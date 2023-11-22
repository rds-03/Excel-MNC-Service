import fs from 'fs'
import {Request,Response} from 'express'
import Jimp from 'jimp'

// Controller function to generate certificate images
const generateCertificates = async (req:Request, res:Response) => {
  try {
    const namesArray:string[]= req.body.names.split(","); // Split the names string into an array
    const templatePath: string = (req.file as Express.Multer.File).path; // Path to the uploaded template image
    const xCoordinate:number= 100;
    const yCoordinate :number= 50;
    // console.log(templatePath);
    // Load the template image
    const template = await Jimp.read(templatePath);

    // Loop through each name and create a certificate image
    for (const [index, name] of namesArray.entries()) {
      const certificate = template.clone();
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

      // Print the name onto the certificate image
      certificate.print(font, xCoordinate, yCoordinate, name);

      // Save the certificate image with a unique name
      await certificate.writeAsync(
        `certificates/certificate_${index + 1}_${name}.jpg`
      );
    }

    fs.unlinkSync(templatePath); // to remove the template

    res
      .status(200)
      .json({ message: "Certificate images generated successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate certificate images." });
  }
};

export { generateCertificates}
