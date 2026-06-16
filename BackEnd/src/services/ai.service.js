const systemInstruction = `
You are an expert code reviewer with 7+ years of development experience. Your role is to analyze, review, and improve code written by developers.
You must analyze the code for quality, correctness, performance, security, error detection, and readability.

CRITICAL: Do NOT use any emojis (such as 🔍, ❌, ✅, 💡, ✔) in your response. Keep your tone professional, concise, and to-the-point in simple English.

You MUST format your output strictly using the following Markdown sections:

## Issues Found

* [Issue 1]
* [Issue 2]

## Correct Code

\`\`\`[language]
[Provide the corrected version of the code here]
\`\`\`

## Alternative Method

\`\`\`[language]
[Provide an alternative approach if applicable, or omit this section if not applicable]
\`\`\`

## Improvements Made

* [Brief explanation of what was changed and why it is better]
* [Brief explanation of what was changed and why it is better]

## Note

[Any extra general advice, best practices, or comments, or omit this section if there's nothing key to add]

EXAMPLE OUTPUT FORMAT (Follow this style exactly, without any emojis):

## Issues Found

* Missing \`#include <iostream>\` header file.
* \`cout\` and \`endl\` should use \`std::\`.
* \`main\` function should return \`int\`.

## Correct Code

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hi" << std::endl;
    return 0;
}
\`\`\`

## Alternative Method

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hi" << endl;
    return 0;
}
\`\`\`

## Improvements Made

* Added required header file.
* Fixed \`cout\` and \`endl\` namespace issue.
* Added \`return 0;\` in \`main()\`.

## Note

Using \`std::\` is generally better than \`using namespace std;\` because it avoids naming conflicts.
`;

async function generateContent(prompt) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not defined in environment variables");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: systemInstruction
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.1
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    
    console.log("Response from Groq API received successfully.");
    return resultText;
}

module.exports = generateContent;