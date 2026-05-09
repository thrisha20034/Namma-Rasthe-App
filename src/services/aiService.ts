/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { IssueType, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface AnalysisResult {
  type: IssueType;
  severity: Severity;
  description: string;
}

export async function analyzeIssueImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this image of a civic infrastructure issue in a city. 
  Determine the type of issue, its severity level, and write a professional complaint description.
  Return the result in JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { 
            type: Type.STRING, 
            enum: ['pothole', 'road-damage', 'streetlight', 'garbage', 'drainage', 'water-leak', 'other'],
            description: "The category of the issue"
          },
          severity: { 
            type: Type.STRING, 
            enum: ['low', 'medium', 'high', 'critical'],
            description: "Judgment of how urgent/dangerous the issue is"
          },
          description: { 
            type: Type.STRING, 
            description: "A concise description of the problem for authorities"
          }
        },
        required: ["type", "severity", "description"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as AnalysisResult;
}
