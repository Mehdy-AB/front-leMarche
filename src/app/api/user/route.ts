import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
// Removed the import of Blob from 'buffer' as it conflicts with the global Blob type.
const data={

    "title"       : "adsone",

    "description" : "test one ",

    "price"       : 500,

    "status"      : "ACTIVE",

    "images": ["iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAATlBMVEUAAAAAAAAICAgJCQkKCgoLCwsMDAw4ODivqwKwqwKxqwKyqwK0tLTsFA7sFQ7sFg7sFw7tGA7t5Nbt7M/u7c/6xXb7xXb9wWn9/f3///+3I2mTAAAAAXRSTlMAQObYZgAAAVdJREFUWMPtlg1zgyAMhqVUPtyUrptu/P8/OpAImMZq8W699XxzrWKTp69YQqsKNCBVSN1PCAvCn68CoL4rBryAA9vZnQ5GQrvPgaUcfIOGBbEVrQLc9xoXXQwD43A0CSDl4F49BlysD2NbuBNjw5UPiAS4Muf3eusg1Bu46RYTIkCEfJFK3xccGNoBr2tRnzn3RedUTzkwpAPOed8LfkIGhql+1cFJCGchOEBzYO46yH9I1QYt5v1jQL548iM+p/IOwAF4JYCX7+/SaRp/gmLvT3mKXGFbAVrrfYDdDkgA5DR5sv4apWewkKEY0/6NbQbEXTRm6JkrGjAStJ5twwUAVQxgAcCKAGGq1I2BxwDeAjLw1wDW4PrnA96QIkCCpvMlwN0NEy8mqmnkY4WBDwNcY3iyA/wUGjRZVBON/5312BSmKlUEyJ/8ATgARQCyL8hMawDcCn4BNjKQKBwekC8AAAAASUVORK5CYII=",
    "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAATlBMVEUAAAAAAAAICAgJCQkKCgoLCwsMDAw4ODivqwKwqwKxqwKyqwK0tLTsFA7sFQ7sFg7sFw7tGA7t5Nbt7M/u7c/6xXb7xXb9wWn9/f3///+3I2mTAAAAAXRSTlMAQObYZgAAAVdJREFUWMPtlg1zgyAMhqVUPtyUrptu/P8/OpAImMZq8W699XxzrWKTp69YQqsKNCBVSN1PCAvCn68CoL4rBryAA9vZnQ5GQrvPgaUcfIOGBbEVrQLc9xoXXQwD43A0CSDl4F49BlysD2NbuBNjw5UPiAS4Muf3eusg1Bu46RYTIkCEfJFK3xccGNoBr2tRnzn3RedUTzkwpAPOed8LfkIGhql+1cFJCGchOEBzYO46yH9I1QYt5v1jQL548iM+p/IOwAF4JYCX7+/SaRp/gmLvT3mKXGFbAVrrfYDdDkgA5DR5sv4apWewkKEY0/6NbQbEXTRm6JkrGjAStJ5twwUAVQxgAcCKAGGq1I2BxwDeAjLw1wDW4PrnA96QIkCCpvMlwN0NEy8mqmnkY4WBDwNcY3iyA/wUGjRZVBON/5312BSmKlUEyJ/8ATgARQCyL8hMawDcCn4BNjKQKBwekC8AAAAASUVORK5CYII="],

    "attributes"  : [{
        "attributeId"           : 1,
        "attributeCollectionId" : 1,
        "value"                 : "string"
    },{
        "attributeId"           : 1,
        "attributeCollectionId" : 1,
        "value"                 : 1
    }],

    "categoryId"  : 1,

    "typeId"      : 1,  

    "brandId"     : 1,

    "modelId"     : 1,

    "locationId"  : 1
}

export async function POST() {


    const videoStream = fs.createReadStream("C:\\Users\\mahdi\\Videos\\Desktop\\gg.mp4");
    const videoChunks: Uint8Array[] = [];
    for await (const chunk of videoStream) {
        videoChunks.push(chunk);
    }
    const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('video', videoBlob, "video.mp4");

    console.log("video",videoBlob);
  try {
    const response = await fetch(`http://localhost:8000/user/createAd`, {
      method: 'POST',
      headers: {
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJtZWhkaSIsImVtYWlsIjoibWFoZGkuYW91bmUwNEBnbWFpbC5jb20iLCJwYXNzd29yZHZlcnNpb24iOiIyMDI1LTA0LTExVDIxOjE0OjM4LjgxMVoiLCJpYXQiOjE3NDQ0MDYwOTksImV4cCI6MTc0OTU5MDA5OX0.ehiKkjsnSxqW4K06f1Jb_l8VduJsk5rOifqCuKyt1Cs",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}