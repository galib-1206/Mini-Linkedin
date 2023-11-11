const Minio = require ('minio');

const minioClient = new Minio.Client({
    endPoint: "storyobjectdb",
    port: 9000,
    accessKey: "admin",
    secretKey: "password",
    useSSL: false
});

module.exports = minioClient;