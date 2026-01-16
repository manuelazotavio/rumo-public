import { createClient } from "@supabase/supabase-js";
import path from "path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const uploadProfileImage = async (req, res, next) => {
 
  if (!req.file) return next();

  try {
    const file = req.file;

    const nameWithoutExt = path.parse(file.originalname).name.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const extension = path.parse(file.originalname).ext; 
    

    const fileName = `guides/${Date.now()}-${nameWithoutExt}${extension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("rumo") 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from("rumo")
      .getPublicUrl(uploadData.path); 

    req.fileUrl = publicData.publicUrl;
    
    next();
  } catch (error) {
    console.error("Erro no upload para o Supabase:", error);
    return res.status(500).json({ error: "Falha ao fazer upload da imagem." });
  }
};