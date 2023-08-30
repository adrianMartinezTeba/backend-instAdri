AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // Otras opciones de configuración
  });
  
  const s3 = new AWS.S3();
  
  module.exports = s3;