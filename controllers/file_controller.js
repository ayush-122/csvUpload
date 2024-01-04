/** ------------------ IMPORTING PACKAGE/MODELS ------------------ **/
const fs = require('fs');
const csvParser = require('csv-parser');
const CSV = require('../models/csv');
const path = require('path');

/** ------------------ EXPORTING FUNCTION To upload a file ------------------ **/
module.exports.upload = async function(req, res) {
    try {
        // file is not present
        if(!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        // file is not csv
        if(req.file.mimetype != "text/csv") {
            return res.status(400).send('Select CSV files only.');
        }
        // console.log(req.file);
        let file = await CSV.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            file: req.file.filename
        });
        return res.redirect('/');
    } catch (error) {
        console.log('Error in fileController/upload', error);
        res.status(500).send('Internal server error');
    }
}

/** ------------------ EXPORTING FUNCTION To open file viewer page ------------------ **/
module.exports.view = async function(req, res) {
    try {
        // console.log(req.params);
        let csvFile = await CSV.findOne({file: req.params.id});
        // console.log(csvFile);
        const results = [];
        const header =[];
        fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
        .pipe(csvParser())
        .on('headers', (headers) => {
            headers.map((head) => {
                header.push(head);
            });
            // console.log(header);
        })
        .on('data', (data) =>
        results.push(data))
        .on('end', () => {
         totalLength=results.length;
           //  console.log(results);
           //pagination
             const page =req.query.page||1;
             const limit =100;
            //page 3 limit 10 then startindex =(page-1)*limit
            const startIndex=(page-1)*limit;
            const endIndex=Math.min(page*limit,results.length);

            const paginatedResults= results.slice(startIndex,endIndex);

            const numberOfPages =Math.ceil(results.length/limit);

            let iterator =(page-5)<1?1:(page-5);
            let endingLink = (iterator+6)<=numberOfPages?(iterator+6):(numberOfPages);

            res.render("file_viewer", {
                pageTitle: "File Viewer",
                fileName: csvFile.fileName,
                head: header,
                data: paginatedResults,
                length: paginatedResults.length,
                iterator,endingLink,page,numberOfPages,totalLength
            });
        });


    } catch (error) {
        console.log('Error in fileController/view', error);
        res.status(500).send('Internal server error');
    }
}

/** ------------------ EXPORTING FUNCTION To delete the file ------------------ **/
module.exports.delete = async function(req, res) {
    try {
        // console.log(req.params);
        let isFile = await CSV.findOne({file: req.params.id});

        if(isFile){
            let filepath= path.join(__dirname,'..', isFile.filePath);
            console.log(filepath);
            fs.unlink(filepath,function(err){
                if(err) throw err;
                console.log('File deleted');
            })
            await CSV.deleteOne({file: req.params.id});            
            return res.redirect("/");
        }else{
            console.log("File not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return;
    }
}