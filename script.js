document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector('form');
    const input = document.querySelector('input');
    const resultDiv = document.querySelector('#result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const text = input.value.trim();

        if (!text) {
            displayError("Please enter a word to explain.");
            return;
        }

        displayLoading();

        try {
            const explanation = await getExplanation(text);
            resultDiv.innerHTML = `<p class="text-xl text-gray-700">${explanation}</p>`;
        } catch (error) {
            console.error(error);
            displayError("Sorry, an error occurred.");
        }
    });

    async function getExplanation(word) {
        const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
        const API_KEY = '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';  // NOTE: This should be fetched from server-side or kept securely

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant."
                    },
                    {
                        role: "user",
                        content: `Explain the following word: ${word}`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('API response was not OK.');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    function displayError(message) {
        resultDiv.innerHTML = `<p class="text-xl text-red-500">${message}</p>`;
    }

    function displayLoading() {
        resultDiv.innerHTML = `<div class="w-16 h-16 border-t-4 border-b-4 border-teal-500 rounded-full animate-spin mx-auto mt-4"></div>`;
    }
});
