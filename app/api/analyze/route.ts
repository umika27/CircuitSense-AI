import { NextResponse } from "next/server";
import { analyzeCircuit } from "@/lib/gemini";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const description = formData.get("description");
    const image = formData.get("image");
    const cleanDescription =
      typeof description === "string" ? description.trim() : undefined;

    if (!cleanDescription && !(image instanceof File && image.size > 0)) {
      return NextResponse.json(
        { error: "Provide a circuit image, a description, or both." },
        { status: 400 },
      );
    }

    let encodedImage: { mimeType: string; base64: string } | undefined;

    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ error: "Uploaded file must be an image." }, { status: 400 });
      }

      if (image.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Image must be smaller than 8 MB." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      encodedImage = {
        mimeType: image.type,
        base64: buffer.toString("base64"),
      };
    }

    const analysis = await analyzeCircuit({
      description: cleanDescription,
      image: encodedImage,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Circuit analysis failed. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
