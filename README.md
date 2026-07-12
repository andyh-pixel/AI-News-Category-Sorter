# AI Agentic News Classification System

## Project Overview

The **AI Agentic News Classification System** is a web-based application that uses multiple AI classification models to analyze and categorize news articles. The system allows a client to upload a CSV file through an HTML interface, which is then processed by a backend server.

After receiving the uploaded CSV file, the server parses the data and divides the articles into smaller batches of 25 records. These batches are sent to two independent AI zero-shot classification models for analysis. Each AI model returns a classification result represented as a numerical value corresponding to a news category.

---



# Group Member Satisfaction and Agreement of Work.

* All group members have agreed in writing on the distribution of work and believe it reflects a fair distribution.

* All group members are satisfied with the contributions that each member have contributed and if unsatisfied will have made it known to the professor.

* All group members works are their own and not copied from the internet. We have made an effort to use the example code provided and turn it into our own project.

---



# Project Members & Work Dispersement

| Member | Name   | Work Dispersement                               |
| ------ | ------ | ------------ | ----------------------------------------------- |
| 1      | Erik Gabriel Francisco | Initial setup & app.get methods, HTTPS get/post for webpages, Presentation, Major Report work |
| 2      | Thanh Duy Hoang | HTML/CSS for results & index, implementing display logic for statistics, Major Report work |
| 3      | Matthew Leslie | Inner server file methods logic, csv parsing, AI integration, Database, Minor report work |

All members will be present and present their part during the in class presentations

Additionally note that the project/file setup by Erik was done before the github was created, so there is no commit of his work.

---


# Project Structure

The project is organized into frontend pages, backend processing modules, AI classification components, and database management files.

```
AI-News-Classification/
│
├── html/
│   ├── index.html              # Upload page
│   ├── results.html            # Classification results page
│   └── other HTML pages
│
├── uploads/
│   └── uploaded CSV files      # Stores client uploaded datasets
│
├── app.js                      # Main server application
│
├── classifierA.js              # First AI zero-shot classifier
│
├── classifierB.js              # Second AI zero-shot classifier
│
├── database.js                 # SQLite3 database management
│
├── database.sqlite             # Stored classification results
│
└── README.md                   # Project documentation
```

---

# System Workflow

The application follows the following workflow:

1. **CSV Upload**

   * The client uploads a CSV file through the HTML interface.
   * The uploaded file is sent to the backend server.

2. **File Processing**

   * The server receives the file and stores it inside the `/uploads` directory.
   * The CSV data is parsed and prepared for classification.

3. **Data Chunking**

   * The CSV records are divided into groups of 25 rows.
   * Each chunk is sent to the AI classifiers for processing.

4. **AI Classification**

   * The server sends each chunk to two separate zero-shot classification models:

     * Classifier A
     * Classifier B
   * Each model returns a numerical classification result.

5. **Database Storage**

   * The classification results are stored using SQLite3.
   * Each prediction is associated with the original article data and expected classification.

6. **Result Comparison**

   * The server compares the AI-generated classifications against the expected labels.
   * Accuracy information is calculated for each model.

7. **Results Display**

   * The final comparison results are displayed on the results page.

---

# How to Use the Project

Start the server:

```
node app.js
```

Once the server is running:

1. Open the index.html page in a browser.
2. Upload a CSV dataset containing news articles.
3. Submit the file for processing.
4. Wait for the AI models to classify the uploaded articles.
5. Navigate to the results page to view the comparison between the two classifiers.

---

# Backend Components

## app.js

The main application server.

Responsibilities:

* Handles client requests.
* Receives uploaded CSV files.
* Communicates with AI classifiers.
* Processes classification results.
* Stores results in the database.

---

## classifierA.js

Contains the implementation of the first zero-shot classification AI model.

Responsibilities:

* Receives article text.
* Performs classification.
* Returns classification results.

---

## classifierB.js

Contains the implementation of the second zero-shot classification AI model.

Responsibilities:

* Receives article text.
* Performs classification.
* Returns classification results.

---

## database.js

Handles SQLite3 database operations.

Responsibilities:

* Creates database tables.
* Inserts classification results.
* Retrieves stored predictions.
* Supports comparison queries.

---

# AI Use Disclosure

As noted in the assignment posting, AI can be used with disclosure and citations. AI has been used for the following in this project:

* Error checking of code
* Researching local models & Implementation styles [https://huggingface.co/docs/transformers.js/en/pipelines] [https://huggingface.co/Xenova/mobilebert-uncased-mnli] [https://huggingface.co/Xenova/bart-large-mnli]
* Model research into quantization [https://huggingface.co/docs/transformers.js/guides/dtypes]
* Formatting of the readme file with manually entered text.


**AT NO POINT WAS AI USED FOR ANY OF THE FOLLOWING**

* Generating Code for html pages/app.js/database.js/sql implementation
* Creation of the Presentation
* Creation of the Report


---
