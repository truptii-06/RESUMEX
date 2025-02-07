window.onload = function() {
    async function downloadImageAsDoc(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = async function () {
                const base64data = reader.result.split(',')[1];

                // Check if docx library is available
                if (!window.docx) {
                    console.error("docx library is not available.");
                    return;
                }

                const { Document, Packer, Paragraph, ImageRun } = window.docx;

                const doc = new Document({
                    sections: [
                        {
                            children: [
                                 // Add some editable text
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: Uint8Array.from(atob(base64data), c => c.charCodeAt(0)),
                                            transformation: { width: 500, height: 700 },
                                        }),
                                    ],
                                }),
                            ],
                        },
                    ],
                });

                // Generate .docx file and trigger download
                const docBlob = await Packer.toBlob(doc);
                const url = URL.createObjectURL(docBlob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Resume_Template.docx"; // Save as .docx
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        } catch (error) {
            console.error("Error downloading the image:", error);
        }
    }

    // Attach the function to the window object so it's accessible globally
    window.downloadImageAsDoc = downloadImageAsDoc;
};
