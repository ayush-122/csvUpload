document.addEventListener('DOMContentLoaded', function () {
    let uploadButton = document.getElementById('upload');

    uploadButton.addEventListener('click', function (event) {
        event.preventDefault();
        validateFile();
    });

    function validateFile() {
        const csvFileInput = document.getElementById('csvFile');

        if (!csvFileInput.files.length) {
            alert('Please choose a file to upload.');
            return;
        }

        const file = csvFileInput.files[0];
        console.log(file);
        if (file.type!= "text/csv") {
            alert('Invalid file type. Please upload a CSV file.');
            return;
        }

         setTimeout(function()
         {
            console.log('next line after delay');
            document.querySelector('form').submit();
         },5000);
        // If the file type is valid, proceed with form submission or further processing
     
     }
});
