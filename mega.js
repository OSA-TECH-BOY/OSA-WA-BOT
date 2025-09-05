import * as mega from 'megajs';

// Mega authentication credentials
k49gblI6txA3DfaaQ5B97afndaMpYggPktM/9i+wSrImI9WXjkadhu3fAMbYuS+BVjxTpKdCN8+EYzvGcqcqs5qDG46rYelpGFzsrjTwYIBYvxx94dJPQiFKXDfSfAxRYdZJq8fCIRrpKdoybUjHINksw89sKXykt+H8Klp3fw6RczV9RjmGYrzmjAqX3apc1X0CbEmpg1VSL6AyeeDopSi/tVMyu6rk+hgrBaFunwlEoLyeZls1FGIW7bSqEUNat2ygibm2ormT7YVG0fFjl4/WblEtIF40G5kXp1tr7TrUOEs4IftQWzn4bmAOMnLqe8rHzJvwLOuHGbKsnOFhgKpHgLC2BG9UMoHu66otITo4TyLyfU93hRckWEktBhDTttB7Y90kbT8F5rmbzMtF4A==

// Function to upload a file to Mega and return the URL
export const upload = (data, name) => {
    return new Promise((resolve, reject) => {
        try {
            // Authenticate with Mega storage
            const storage = new mega.Storage(auth, () => {
                // Upload the data stream (e.g., file stream) to Mega
                const uploadStream = storage.upload({ name: name, allowUploadBuffering: true });

                // Pipe the data into Mega
                data.pipe(uploadStream);

                // When the file is successfully uploaded, resolve with the file's URL
                storage.on("add", (file) => {
                    file.link((err, url) => {
                        if (err) {
                            reject(err); // Reject if there's an error getting the link
                        } else {
                            storage.close(); // Close the storage session once the file is uploaded
                            resolve(url); // Return the file's link
                        }
                    });
                });

                // Handle errors during file upload process
                storage.on("error", (error) => {
                    reject(error);
                });
            });
        } catch (err) {
            reject(err); // Reject if any error occurs during the upload process
        }
    });
};

// Function to download a file from Mega using a URL
export const download = (url) => {
    return new Promise((resolve, reject) => {
        try {
            // Get file from Mega using the URL
            const file = mega.File.fromURL(url);

            file.loadAttributes((err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Download the file buffer
                file.downloadBuffer((err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer); // Return the file buffer
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

