## Editorial strategy

The editorial strategy makes it possible to create a set of questions from a reduced number of keywords or expressions (2 or 3) separated by ",". These elements are analyzed by the AI ​​via a prompt which builds a glossary of 50 questions from this information.

For example, the prompt available by default (and only visible in expert mode) can be (because it is changed regularly for testing) is the following (the variables *$keywords* and *$context* are respectively replaced by the keywords entered in the corresponding field and by the interview that you may have done - from your vocal):

<div class="pre">
$context

Help yourself from this context to give me a list of 4 questions (Why, How, When, What) for each of the following keywords ($keywords) in csv format, without any text neither before nor after, with the following format , and don't forget the first line:
"Keyword", "Preposition", "Question"
</div>

Another prompt example: Glossary

<div class="pre">
$context

Use this context to build a glossary of 50 words about: "$keywords"
</div>

As part of the editorial strategy, You can modify the prompt but you must obtain a list of questions or words, line by line. As part of this test, a date will simply be added in front of each line. You can imagine that we could build much more complex strategies based on multiple criteria (content format - question or white paper or file, role of the respondent - director or sales director or marketing director or technical director or collaborator, response framework - TOFU/MOFU/BOFU or AIDA or PAS, number of participants - 1 or 4 or 50).

This is why the editorial strategy is a text field, in which you can simply copy/paste a csv file...)

If it doesn't work anymore, your prompt doesn't follow the rules that Veep understands. Delete ALL your prompt, it will then be replaced by the initial prompt.
