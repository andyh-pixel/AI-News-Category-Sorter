const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

//database run/all require /database.js
const { run, all } = require("./database");

//Models require classifierA/B.js
const modelA = require("./classifierA");
const modelB = require("./classifierB");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

//upload file to this directory
const upload = multer({ dest: "uploads/" });

const BATCH_SIZE = 25;

const LABEL_TO_CLASS_INDEX = {
    "World": 1,
    "Sports": 2,
    "Business": 3,
    "Sci/Tech": 4
};

const categoryNames = {
    1: "World",
    2: "Sports",
    3: "Business",
    4: "Sci/Tech"
 };


function topClassIndex(zeroShotResult) {
    const topLabel = zeroShotResult?.labels?.[0];
    return LABEL_TO_CLASS_INDEX[topLabel] ?? null;
}

function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

// Default page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Results page (this is what your header link points to)
app.get("/results", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "results.html"));
});

// Results data
// Results data
// Results data
app.get("/results-data", async (req, res) => {
    try {

        // Overall totals
        const totals = await all(`
            SELECT
                COUNT(*) AS total,
                SUM(modelA_correct) AS modelA_correct,
                SUM(modelB_correct) AS modelB_correct
            FROM results
        `);

        // Category breakdown
        const categoryStats = await all(`
            SELECT
                expected_class,
                COUNT(*) AS total,
                SUM(modelA_correct) AS modelA_correct,
                SUM(modelB_correct) AS modelB_correct
            FROM results
            GROUP BY expected_class
            ORDER BY expected_class
        `);

        const categoryDistribution = {};

        // Ensure every category exists
        Object.values(categoryNames).forEach(name => {
            categoryDistribution[name] = {
                articles: 0,
                classifierA: 0,
                classifierB: 0
            };
        });

        // Fill with database values
        for (const row of categoryStats) {

            const category = categoryNames[row.expected_class];

            categoryDistribution[category] = {
                articles: row.total,
                classifierA: row.total
                    ? (row.modelA_correct / row.total) * 100
                    : 0,
                classifierB: row.total
                    ? (row.modelB_correct / row.total) * 100
                    : 0
            };
        }

        const total = totals[0].total || 0;
        const modelACorrect = totals[0].modelA_correct || 0;
        const modelBCorrect = totals[0].modelB_correct || 0;

        res.json({
            totalArticles: total,
            classifierAAccuracy: total
                ? (modelACorrect / total) * 100
                : 0,
            classifierBAccuracy: total
                ? (modelBCorrect / total) * 100
                : 0,
            categoryDistribution
        });

    } catch (err) {
        console.error("Results error:", err);
        res.status(500).json({ error: "Failed to load results" });
    }
});

// Upload
app.post("/upload", upload.single("csv"), async (req, res) => {
    const filePath = req.file.path;
    const rows = [];

    fs.createReadStream(filePath)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
            try {
                const batches = chunkArray(rows, BATCH_SIZE);

                for (const batch of batches) {
                    const texts = batch.map((row) => {
                        const title = row["Title"] || "";
                        const description = row["Description"] || "";
                        return `${title}. ${description}`;
                    });

                    const [modelA_batch, modelB_batch] = await Promise.all([
                        modelA.predict(texts),
                        modelB.predict(texts)
                    ]);

                    for (let i = 0; i < batch.length; i++) {
                        const row = batch[i];

                        const expected = Number(row["Class Index"]);
                        const title = row["Title"] || "";
                        const description = row["Description"] || "";

                        const modelA_raw = modelA_batch[i];
                        const modelB_raw = modelB_batch[i];

                        const modelA_pred = topClassIndex(modelA_raw);
                        const modelB_pred = topClassIndex(modelB_raw);

                        const modelA_correct = modelA_pred === expected ? 1 : 0;
                        const modelB_correct = modelB_pred === expected ? 1 : 0;

                        await run(
                            `INSERT INTO results (
                                title,
                                description,
                                expected_class,
                                modelA_prediction,
                                modelB_prediction,
                                modelA_correct,
                                modelB_correct,
                                modelA_raw_response,
                                modelB_raw_response
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                title,
                                description,
                                expected,
                                modelA_pred,
                                modelB_pred,
                                modelA_correct,
                                modelB_correct,
                                JSON.stringify(modelA_raw),
                                JSON.stringify(modelB_raw)
                            ]
                        );
                    }
                }

                fs.unlinkSync(filePath);

                res.json({ success: true, rowsProcessed: rows.length });

            } catch (err) {
                console.error("Upload error:", err);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                res.status(500).json({ error: "Error processing CSV file." });
            }
        });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});