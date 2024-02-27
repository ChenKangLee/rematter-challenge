# Rematter SWE Challenge

This is a driver's license text extraction web app for the Rematter SWE interview process.

## 1. Archtitecture Overview

The project is designed to run purely in browser, without making any API calls. The technology used for this project can be grouped into the following areas:

### General Framework

- General JS Framework: [`Vue.js`](https://vuejs.org/)
- Front-end Framework: [`Quasar`](https://quasar.dev/)
- Dev tool: [`Vite.js`](https://vitejs.dev/)
- Storage & State Management: [`Pinia.js`](https://pinia.vuejs.org/) & `IndexDB`

### Image Processing

- Image Processing: OpenCV Javascript wrapper by [`@Techstark`](https://www.npmjs.com/package/@techstark/opencv-js)
- OCR: [`Tesseract.js`](https://tesseract.projectnaptha.com/)

### Extracted Text Post Processing

- Fuzzy match: [`Fuse.js`](https://www.fusejs.io/)

In the following section, I will dive deeper into the design details.

## 2. Design Deep Dive

### 2.1 Web App Structure

The core component of the web applcation is the `JobTable`. Which provides a tabular view to allow ease of access to past submitted recognition jobs. The state is managed through the data store library `Pinia` for Vue.js applications. To allow the state to persist across sessions without a backend, I stored the rows in a **IndexDB** database.

To submit a new job, the user opens a pop-up dialog, which contains a live feed of the webcam in a canvas element. The live feed is implemented using the `MediaDevices` web API. For compatability considerations, I have limited the feed to 720p. When the user clicks the capture button, it kicks of an asynchronous process of image preprocessing and text extraction (which we will describe in more detail in the next section). As each job is processed, it's state is reflected on the 'status' row of the table. The user can click each job on the table to see the detail of each recognition results.

### 2.2 State Management

Since this project has the requirement of being completely contained in the browser, we need some workarounds to store complex data as states that would persist across webpage reloads. As mentioned in the previous section, previous jobs are stored as rows in the IndexDB NoSQL database. Another part of the application that requires persistent state is the primaryKey for the rows in the IndexDB, which again I implemented with the `Pinia` data store, but this time with the `localStorage` web API as the backend since it is perfect for these small amount of non-complex data.

### 2.3 Image Processing & OCR

he restriction of doing all the processing in-browser post quite a limitation on the libraries I could use for image preprocessing and OCR. Fortunately I was able to find a Javascript wrapper for OpenCV that runs in-browser.

To enhance the OCR result, I have experiment extensively on the preprocessing steps that could make text recognition perform better. Generally I have experimented with different combinations of the following operations:

- Converting to grey scale
- Adjusting contrast and brightness
- Shaprening by subtracting Gaussian Blur
- Equalize Histograms
- Adaptive Thresholding (e.g. Otsu's Thresholding)
- Distance Transformation to remove background shapes
- Morphology operations such as Opening and Closing

However, other than the first three, I wasn't getting much better results. And it seems that the OCR library (Tesseract.js) is performing a lot of processing under the hood too, so I decided to keep it simple and stick with applying the first three operations.

For the OCR, I am using the Tesseract.js library. Which, depend on the lighting and webcam capture quality, gives quite varying results. Therefore I had to do some post processing to extract the fields that I'm interested in. I will go through the details of post processing in the next section.

### 2.4 Text Extraction Post Processing

First of all, due to the imperfections in the capture and the document itself, Tesseract occationally incorrectly read the characters as non-alphabetical ASCII characters. So my first step of postprocessing is to replace these common mistakes with their alphabetical counterparts (for example `.replace(/[ÀÁÂÃÄÅàáâãäåΑАа]/gi, "A")`)

Next, since driver license formats varies greatly across different states. I tried to extract the issue state of the document. To achieve this, I performed a "reversed-fuzzy-search", where I use the fuze.js fuzzy search to check if any state name has appeared in the extracted text. The extracted state is used to determine the post processing for the DL number.

For the DL number, each state has a different format, so I employed regular expression to search through the text to find matches.

For the other fields, I followed the similar approache, where I perform regular expression search on the processed extracted text. Once the post processing is complete, a call back is fired to update the status in the `JobTable` to update the rows.

## 3. Experiment Settings

The experiments are conducted on the Apple Macbook Air (2022), with the 1080p webcam. Since I do not have access to a wide variety of US driver's licenses (and pictures of them don't really represent the use case of webcam captures), I was only testing with California Driver licenses.
