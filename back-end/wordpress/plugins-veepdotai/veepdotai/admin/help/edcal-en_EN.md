## Editorial calendar

The editorial calendar is the screen you'll use most frequently. It allows you to create content by answering the question of the day, and to publish your answer. Your response, initially oral, is transcribed and then analyzed by the AI, which extracts a set of information and generates a blog article and a post for LinkedIn.

Your blog post contains a link to your voice to ensure authentic content. The reader can therefore verify that the post has not been created from scratch, but from real content. Artificial Intelligence has simply assisted human writing, but not replaced it. That's what we call authentic content at VEEP.

Some of you may find that AI enrichment is not enough. I invite you to take a look at the advanced mode below to see how you can overcome this. You'll be able to enhance your content, but at the cost of authenticity. It all depends on what you're looking for...

### How to use

Choose a question from the drop-down list. You answer the question of the day (your communications/marketing team having created a communications strategy aligned with the company's strategy so you don't have to worry about it).

Click the green "Record" button. Authorize the use of the microphone if the question is asked. You can then answer the question. The question should normally seem very simple to you, it addresses a subject that you deal with on a daily basis. Your answer is therefore natural as if it were a discussion with a member of your family, a friend, a colleague, a client.

When the response is complete, click "Stop". You can then:
* listen to your message (I advise against it - do you listen to your conversations with your family, your colleagues?),
* delete your message (and therefore start again),
* transcribe your voice,
* post your answer.

Click "Publish" if you are satisfied. A window appears. Processing may take between 1 and 2 minutes. When it is finished, you are redirected to the blog page that was produced. This page is made under Wordpress, so you can modify it.

To make a LinkedIn post from this page, click the LinkedIn icon. A LinkedIn window then opens. It references your current page. Click on "Publish a post". You can then add a text, for example the one produced at the same time as the blog article. It has been automatically copied to your clipboard, you just have to paste it on your screen.

### Advanced mode

Initially in beginner mode, by clicking on Beginner/Expert at the top of the screen, you switch to expert mode, which has the effect of presenting all the fields and all the possible actions. By clicking again on this button, you switch to the reverse mode, etc...

By clicking at the top of the screen on 'Article', located next to Vocal, itself located under the list of questions, you switch to a form that presents all the information that characterizes a blog article and a LinkedIn post.

If the fields are empty, you have not yet answered a question or generated content.

Answer a question if you haven't already.

### Prompt

For example, the prompt available by default (and only visible in expert mode) is the following (the variable **$inspiration** is replaced by the transcription of your vocal):

<div class="pre">
Here is an interview:

$inspiration

End of interview

Write, from this interview, a long blog article of 500 words in French in markdown format, with line breaks, acting as a copywriter specialized in SEO, in a journalistic and professional style. You will put in bold the words already present in the interview.

The response must be formatted in strict json respecting the following structure, without adding elements outside this structure:
{
    "title": put the title here,
    "description": put the SEO description here,
    "content": put the blog post content in markdown format and in quotes here,
    "linkedin": put here a reformulation of the content of the blog article in the form of a linkedin post of 300 words, consisting of 4 paragraphs, with emojis and line breaks,
    "hashtags": put the hashtags here,
    "themes": extract the 5 main themes from the text and put them here,
    "keywords": extract the 5 SEO keywords from the text and put them here,
    "image": put here a prompt allowing to generate an image for this article
}
</div>

The part of the prompt before 'The response must be formatted...' can be modified in order to produce content more appropriate to your context. Attention, the following part concerning the format must ABSOLUTELY NOT be modified because it allows to produce information respecting rules that VEEP understands.

As a first modification, to see how the AI ​​reacts, you can, for example, change the word 'Write' to 'Reformulate'. The content will then be modified quite significantly. Add 'completely' to see the importance of the adjective.

If it doesn't work anymore, it's because your prompt doesn't respect the rules above (concerning the format). Delete ALL your prompt, it will then be replaced by the initial prompt.