const { pipeline } = require("@huggingface/transformers");

let classifier;
const labels = ["World", "Sports", "Business", "Sci/Tech"];

async function load() {
    if (!classifier) {
        classifier = await pipeline(
            "zero-shot-classification",
            "Xenova/mobilebert-uncased-mnli",
            { dtype: "q8" }
        );
    }
}

/**
 * Accepts an array of texts and classifies them in a single batched call.
 * Returns the RAW model output: an array of {sequence, labels, scores}
 * objects, one per input text, in the same order as the input array.
 */
async function predict(texts) {
    await load();
    const result = await classifier(texts, labels);
    return result;
}

module.exports = { predict };