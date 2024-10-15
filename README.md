# the-veep-factory
Veep.AI supports you in all phases of creating content or a document with AIs. It is an open source “ChatGPT Canvas” type solution allowing you to create/edit long format content with any AI, and not just ChatGPT.

# Features

## Application level (front-end)

* Content creation
  * from voice: microphone or alreay recorded audios or videos
  * from file: pdf, txt, ms office (word, excel, powerpoint), libre office (writer, spreadsheet, impress)...)
  * from text: through copy'n past
  * from url: all (but javascript websites are not well supported)
* Prompt catalog
  * public one
  * personal one
* Prompt pipeline editor
  * OpenAI and Mistral AI models are available
  * Usual configuration parameters (prompt, role, temperature, penalty...)
* Content and document list
  * Search field to filter by name
  * Sort by field
  * Rename, remove, read actions
* Details view based on Chat view and Content/Document view
  * Chat view
    * Contains the result of the automatic chat session (the pipeline trace) 
    * Contains also the transcription and the pipeline details when public
  * Content/Document view
    * Writer actions: Structure (h1, h2... paragraph, blockquote, enumeration...), Formatting (bold, italic, underlien)

## Back-end level

* Wordpress. Used as a auth and storage system, not for its usual CMS capabilities. 
  * Email auth by default
  * Google auth preconfigured (you still must set you Google client ID and secret token)
  * GraphQL and ReST aware, but no public API has been configured. They are internal APIs only and are subject to change, use at your own risk
  * Credits management

* Monitoring
  * Influxdb: to store AI generations information (tokens in/out, results, AI model)
  * Grafana: to view and analyse usage at a user level, at the application level (all users agregated)

# Roadmap

* Writer: AI actions on the road
* Back-end: Headless (Strapi? Payloadcms? Contentsquare...), NoSQL (mongodb...), rdbms (mysql, postgresql, supabase...)
* Monitoring: Time series database

# Resources

## Video

### English version
[![Veep 3.0 demo](https://img.youtube.com/vi/e6Zw30R8CWU/0.jpg)](https://www.youtube.com/watch?v=e6Zw30R8CWU)

### French version
[![Veep 3.0 demo](https://img.youtube.com/vi/dUvMOlhqoz4/0.jpg)](https://www.youtube.com/watch?v=dUvMOlhqoz4)

## Screenshots

### Dashboard
![veep-3 0-dashboard](https://github.com/user-attachments/assets/8f3d106f-40e0-44a4-abc0-5c904be51aab)

### Pipeline
![veep-1 0-create-pipeline](https://github.com/user-attachments/assets/5aba7f56-8088-4bc0-9e96-c02e7d5995ed)

### An assistant for everything, especially for all the corporate's departments
![veep-2 0-create-choose](https://github.com/user-attachments/assets/f65ebd85-39d7-4617-84cb-85c2983c5df5)

### Content Creation
![veep-1 0-create-input](https://github.com/user-attachments/assets/1bf1a04d-d094-4b08-a0da-7259dfcbf7b6)
