<?php

if ( ! defined( 'ABSPATH' ) ) exit;

define('I_CONTENT', 'icontent');
define('V_CONTENT', 'vcontent');
//define('GENERATED_CONTENT', 'gcontent');
define('GENERATED_CONTENT', 'vcontent');
define('MERGED_CONTENT', 'mcontent');
//define('TRANSCRIBED_CONTENT', 'tcontent');
define('TRANSCRIBED_CONTENT', 'vcontent');

add_action( 'my_veepdotai', 'Generation_Process::process_content', 1, 3 );

class Generation_Process {

    public static function log( $msg, $level = 3, $filename = "/tmp/openai.log") {
        //error_log( $msg . "\n", $level, $filename );
        Veepdotai_Util::log( "debug", $msg );
    }

    public static function error_log( $msg, $level = 3, $filename = "/tmp/openai.log") {
        $date = gettimeofday(true);
        self::log("\n$date $msg\n", $level, $filename);
    }

    public static function get_ulf() {
        $user_log_file = Veepdotai_Util::get_user_log_directory() . '/logs.txt';
        $ulf = $user_log_file;

        return $ulf;
    }

    public static function get_urf( $pid ) {
        $user_run_file = Veepdotai_Util::get_user_run_directory() . "/$pid.data";
        $urf = $user_run_file;

        return $urf;
    }

    public static function log_step_started( $user_log_file, $user_run_file, $pid, $topic) {
        self::error_log( $topic . "STARTED_");
        Veepdotai_Util::log_step_started( $user_log_file, $user_run_file, $pid, $topic);
    }

    public static function log_step_started2( $pid, $topic) {
        self::error_log( $topic . "STARTED_");
        Veepdotai_Util::log_step_started( self::get_ulf(), self::get_urf( $pid ), $pid, $topic);
    }

    public static function log_step_finished( $user_log_file, $user_run_file, $pid, $topic) {
        self::error_log( $topic . "FINISHED_");
        Veepdotai_Util::log_step_finished( $user_log_file, $user_run_file, $pid, $topic);
    }

    public static function log_step_finished2( $pid, $topic, $msg = "") {
        self::error_log( $topic . "FINISHED_");
        Veepdotai_Util::log_step_finished( self::get_ulf(), self::get_urf( $pid ), $pid, $topic, $msg);
    }

    public static function log_step_paused2( $pid, $topic, $msg = "") {
        self::error_log( $topic . "PAUSED_");
        Veepdotai_Util::log_step_paused( self::get_ulf(), self::get_urf( $pid ), $pid, $topic, $msg);
    }

    public static function log_step_continued2( $pid, $topic, $msg = "") {
        self::error_log( $topic . "CONTINUED_");
        Veepdotai_Util::log_step_continued( self::get_ulf(), self::get_urf( $pid ), $pid, $topic, $msg);
    }

    public static function get_duration( $start ) {
        $end = gettimeofday( true );
        $duration = round( $end - $start, 1);

        return $duration;
    }

    public static function clean_options() {
        $nbPhases = 10;
        Veepdotai_Util::set_option( 'ai-section-edcal0-prompt', '' );
        Veepdotai_Util::set_option( 'ai-section-edcal0-transcription', '' );
        for( $i = 0; $i < $nbPhases + 1; $i++ ) {
            Veepdotai_Util::set_option( "ai-section-edcal1-phase${i}", '' );
            Veepdotai_Util::set_option( "ai-section-edcal1-phase${i}Content", '' );
            Veepdotai_Util::set_option( "ai-section-edcal1-phase${i}Details", '' );    
        }

    }

    public static function start_process() {
        Veepdotai_Util::log( 'debug', 'start_process');
        
        $user = wp_get_current_user()->user_login;
        self::log( __METHOD__ . ": user: $user" );
        
        $pid = sanitize_text_field( $_POST[ 'veepdotai-ai-pid' ] ?? "" );
        $content_id = sanitize_text_field( $_POST[ 'veepdotai-ai-content-id' ] ?? null );
        self::log( __METHOD__ . ": pid: $pid." );
        self::log( __METHOD__ . ": content_id: $content_id." );
        
        if ( $content_id ) {
            // We are in a resume process. Let's initialize options.
            
        } else {
            Veepdotai_Util::create_directories();
            
            $input_text = sanitize_text_field( $_POST[ 'veepdotai-ai-input-text' ] ?? "" );
            $input_url = sanitize_url( $_POST[ 'veepdotai-ai-input-url' ] ?? "" );
            $chain_id = sanitize_text_field( $_POST[ 'veepdotai-ai-chain-id' ] ?? "");
            $_files = $_FILES;
            
            self::log( __METHOD__ . ": input_text: $input_text." );
            self::log( __METHOD__ . ": input_url: $input_url." );
            self::log( __METHOD__ . ": files: " . json_encode( $_files ) . ".");
            
            // We are in a creation process. Let's clean previous options.
            self::clean_options();
        
            $chain_id = "ai-prompt-" . $chain_id;
            
            $content_id = self::transcribe( $user, $_files, $pid, $chain_id, $input_text, $input_url );
        }

        //do_action('my_veepdotai', $user, $pid, $content_id );
        //$content_id = apply_filters('my_veepdotai', $user, $pid, $content_id );
        $content_id = self::process_content( $user, $pid, $content_id );

        wp_send_json([
            "data" => $content_id
        ]);
    }


    public static function initialize_context( $user, $content_id ) {
        $post = get_post( $content_id );

    }

    public static function transcribe( $user, $_files, $pid, $chain_id, $input_text, $input_url ) {
        self::log_step_started2( $pid, "_TRANSCRIPTION_");   

        if ( $input_text && $input_text != "") {
            self::log( __METHOD__ . ": an input text has been provided: " . $input_text);

            Veepdotai_Util::set_option( 'ai-section-edcal0-transcription', $input_text );
            $metadata = [
                'input_type' => "text",
                'transcription' => $input_text,
                'source' => $input_text,
            ];
        } else if ( $input_url && $input_url != "") {
            self::log( __METHOD__ . ": an input url has been provided: " . $input_url);

            $transcription = apply_filters( "url_provided_as_source", $input_url );
            Veepdotai_Util::set_option( 'ai-section-edcal0-transcription', $transcription );

            $metadata = [
                'input_type' => "url",
                'transcription' => $transcription,
                'source' => $input_url,
            ];
        } else {
            self::log( __METHOD__ . ": a file/stream has been provided.");

            $metadata = self::prepare_content( $user, $_files, $pid, $chain_id);
        }

        $content_id = self::save_metadata( $metadata, $chain_id );
        self::log( __METHOD__ . ": post id after creation: id: " . $content_id );

        self::log_step_finished2( $pid, "_TRANSCRIPTION_", "cid:${content_id}");
        return $content_id;
    }

    public static function prepare_content( $user, $_files = null, $pid, $chain_id ) {
        $file = $_files['veepdotai-ai-input-stream'] ?? null;
        $input_type = "stream";
        if ( ! $file ) {
            $file = $_files['veepdotai-ai-input-file'] ?? null;
            $input_type = "file";
        }

        self::log( __METHOD__ . ": a blob (file or stream) has been provided: " . json_encode( $file ) );

        $data = apply_filters( "blob_provided_as_source", $file, $pid );        
        Veepdotai_Util::set_option( 'ai-section-edcal0-transcription', $data['transcription'] );
        Veepdotai_Util::set_option( 'ai-file-path', $data['output_filename'] );

        $metadata = [
            'input_type' => $input_type,
            'transcription' => $data[ 'transcription' ],
            'veepdotaiTranscription' => $data[ 'transcription' ],
            'source' => $data[ 'output_filename' ],
        ];

        return $metadata;
    }

    public static function update_last_step_done( $lsd, $content_id ) {
        $post_array = array(
            "ID" => $content_id,
            "meta_input" => array(
                "veepdotaiLastStepDone" => $lsd,
            )
        );
        self::log( __METHOD__ . ": post_array: " . print_r( $post_array, true ) );
        $content_id = wp_update_post( $post_array );

        if ( $content_id ) {
            return $content_id;
        } else {
            // Should throw an error
            return $content_id;
        }

    }

    /**
     * Uploads have already been processed because contents are removed when the process is finished.
     * This method processes a list of ids
     * @action my_veepdotai
     */
    public static function process_content( $user, $pid, $content_id )
    {
        self::log( "$pid - Transcribe to publish in background function.");

        Veepdotai_Util::set_user_login( $user );
        self::log( __METHOD__ . ": user: $user." );
        self::log( __METHOD__ . ": pid: $pid." );
        self::log( __METHOD__ . ": content_id: $content_id." );

        $meta = get_post_meta( $content_id );
        self::log( __METHOD__ . ": meta: " . print_r( $meta, true ) );

        /**
         * If it is the first time we are there, we must stop to give the user
         *  an opportunity to review transcription.
         */
        $lsd = $meta[ "veepdotaiLastStepDone" ][0] ?? "";
        self::log( __METHOD__ . ": lsd: " . $lsd );
        if ( $lsd == "Transcription" ) {
            self::log_step_paused2( $pid, "_CONTENT_GENERATION_", "cid:${content_id}");
            self::update_last_step_done( "TranscriptionChecked", $content_id );
            self::log( __METHOD__ . ": write_transcription_details: content_id: " . $content_id);
            do_action("write_transcription_details", $user, $content_id);
    
            return $content_id;
        }

        self::log( __METHOD__ . "Publish user on veepdotai_generation topic.");

        /*
        //$credits = apply_filters("veepdotai_generation");
        $user = get_userdata( $user );
        if (Veepdotai_Util::has_credits( $user )) {

            $nb_credits = Veepdotai_Util::get_credits( $user );
            $operation_costs = 1;
            update_option( $user->user_login );
        };
        */

        $root_string = $meta[ 'veepdotaiPrompt' ][0];
        self::log( __METHOD__ . ": root_string: " . print_r( $root_string, true ) );
        $veeplet = self::analyze_prompt( $root_string );
        if ( ! $veeplet ) {
            self::log( __METHOD__ . ": it is not a veeplet: pb!!! Mayday!!!" );
            // Can't happen. Should throw an error...
            return null;
        }
        
        $prompts = $veeplet['prompts'];
        $chain = Veepdotai_Util::get_chain( $prompts['chain'] );

        $result = "";
        $new_content_id = $content_id;
        for( $i = 0; $i < count( $chain ); $i++) {
            $label = $chain[$i];
            $label_encoded = Veepdotai_Util::encode_prompt_id( $label );

            self::log( __METHOD__ . ": i: ${i}: label: ${label}: key: ${label_encoded}.");

            $current_chain = $label;
            self::log( __METHOD__ . ": current_chain: ${label}.");

            $instructions = $prompts[ $label_encoded ];
            $prompt = $instructions['prompt'];
            self::log( __METHOD__ . ": phase${i} prompt: ${prompt}." );
            
            self::log( __METHOD__ . ": lsd: " . $lsd );
            if ( $lsd === "TranscriptionChecked") {
                // If last step done was TranscriptionChecked, we must continue
                // at least one step
                self::log( __METHOD__ . ": this step must be done. Let's do it!");
            } else {

                if ( $i < $lsd ) {
                    // Step already done. Next.
                    // We must set data to "replay" this execution in case the
                    // user did another generation
                    self::log( __METHOD__ . ": this step has already been done. Next please!");
                    continue;
                }

                if ( $prompt == "STOP" ) {
                    self::log_step_paused2( $pid, "_CONTENT_GENERATION_", "cid:${new_content_id}");
                    //self::update_last_step_done( $chain[$i + 1], $content_id );
                    self::update_last_step_done( $i + 1, $content_id );
                    self::log( __METHOD__ . ": please pause!");
                    return $content_id;
                } else {
                    self::log_step_continued2( $pid, "_CONTENT_GENERATION_", "cid:${new_content_id}");
                }

                self::log( __METHOD__ . ": phase ${i}/${label}/${label_encoded} step is going to be done.");

            }

            $new_content_id = self::generate($content_id, $pid, $veeplet, $instructions, "_PHASE${label_encoded}_GENERATION_", "ai-section-edcal1-phase${label_encoded}", $result, $i, $label_encoded);
//            $content = $res->choices[0]->message->content;
//            $new_content_id = self::save_generation( $content_id, "", $result, $content, $res, "veepdotaiPhase", $i, $label_encoded);

            self::log( __METHOD__ . ": write_generation_details - content_id: {$new_content_id}" );
            do_action( "write_generation_details", $user, $new_content_id );

            //$lsd = self::update_last_step_done( $i, $content_id );
            $lsd = $i;
            //self::log( "Post id after update: " . $new_content_id );
        }

        self::log_step_finished2( $pid, "_CONTENT_GENERATION_");

//        $result = Veepdotai_Util::generate_html_from_markdown ( $result );
        //$result = self::produce_outcome( $content_id );

        return null;            
    }
    
    /**
     * Produce outcome based on the outcome parameter in the veeplet.
     * If no chain_id is provided, returns concatenation of all the phases
     * prefixed by the step name.
     */
    public static function produce_outcome( $content_id ) {

        $result = "";

        if ( ! $chain_id ) {
            //$result = for()
            $post_array = array(
                "ID" => $content_id,
                "post_content" => $result,
            );
            $result = wp_update_post( $post_array );
        }
        //        $result = Veepdotai_Util::generate_html_from_markdown ( $result );

        return $result;

    }

    /**
     * Analyze veeplet definition
     */
    public static function analyze_prompt( $root_string ) {
        if ( ! ( $root_string && preg_match( "/^\[(veepdotai|metadata|details)/", $root_string ) ) ) {
            return null;
        }

        self::log("A prompt is provided.");

        $root_string = preg_replace( "/(#EOL#)/", "\n", $root_string );
        $veeplet = apply_filters( 'veepdotai-process-prompt-toml2object', $root_string );

        self::log( __METHOD__ . ": veeplet: " . print_r( $veeplet, true ) );
        return $veeplet;
    }

    /**
     * Saves metadata:
     * - transcription
     * - prompt
     */
    public static function save_metadata( $metadata, $chain_id ) {

        $transcription = $metadata[ 'transcription' ];
        $input_type = $metadata[ 'input_type' ]; // stream, file, text, url
        $source = $metadata[ 'source' ]; // filename (stream, file), the word "text" or an url

        $root_string = Veepdotai_Util::get_option($chain_id);
        $veeplet = self::analyze_prompt( $root_string );
        if ( ! $veeplet ) {
            // Mayday
            // Error
            $content_type = "default";
            exit;
        }
        $content_type = $veeplet[ 'metadata' ][ 'name' ];

        $domain = $veeplet[ 'metadata' ][ 'classification' ][ 'group' ]??"Tmp";
        $category = $veeplet[ 'metadata' ][ 'classification' ][ 'category' ]??"Tmp";
        $artefact_type = $veeplet[ 'metadata' ][ 'classification' ][ 'subCategory' ]??"Generated";

        $meta_input = array(
            'veepdotaiInputType' => $metadata[ 'input_type' ],
            'veepdotaiTranscription' => $metadata[ 'transcription' ],
            'veepdotaiResource' => $metadata[ 'source' ],
            'veepdotaiPrompt' => preg_replace("/#EOL#/s", "\n", $root_string),
            'veepdotaiLastStepDone' => "Transcription",
            'veepdotaiInputType' => $metadata[ 'input_type' ],

            'veepdotaiDomain' => $domain,
            'veepdotaiCategory' => $category,
            'veepdotaiArtefactType' => $artefact_type,
        );

//        self::log("Transcription: " . $transcription);
//        $transcription = Veepdotai_Util::get_option('ai-section-edcal0-transcription');

        self::log("User: " . wp_get_current_user()->ID);
        $title = $content_type . ' - ' . Veepdotai_Util::get_date();
        self::log("Title: " . $title);
        $content = array(
            'post_title'   => $title,
            'post_content' => $metadata[ 'transcription' ],
            'post_author'  => wp_get_current_user()->ID,
            'post_status'  => 'draft',
            'post_type'    => TRANSCRIBED_CONTENT,
            'post_name'    => $title,
            'meta_input'   => $meta_input
        );
        
        //error_log("content: " . print_r($content, true), 3, "/tmp/creation.log");
        $id = wp_insert_post($content);

        return $id;
    }

    /**
     * topic is label_encoded
     */
    //public static function generate( $pid, $instructions, $topic, $option ) {
    public static function generate( $content_id, $pid, $veeplet, $instructions, $topic, $option, $result, $id, $label_encoded ) {
        /**
         * Process generation
         */
        //$current = $chain; // Should we have to sanitize content?
        //$res = self::log_generation( $ulf, $urf, $pid, $topic, $current['prompt'] );
        $start = gettimeofday(true);
        self::log_step_started2( $pid, $topic );

        $res = self::generate_text( $pid, $veeplet, $instructions, null );

        $content = $res->choices[0]->message->content;
        //Veepdotai_Util::save_extracted_data( $data, $key );
        Veepdotai_Util::set_option( $option, $content );

        $new_content_id = self::save_generation( $content_id, "", $result, $content, $res, "veepdotaiPhase", $i, $label_encoded);

        self::log_step_finished2( $pid, $topic, "cid:${new_content_id}");
        self::log( __METHOD__ . ": generated data: topic: $topic: " . Veepdotai_Util::get_options( $option ));
        self::log( __METHOD__ . ": duration: " . self::get_duration( $start ) );

        //return $res;
        return $new_content_id;
    }

    /**
     * This method replaces all the occurrences of prompts names by their
     * corresponding generated content 
     */
    public static function replace_placeholders( $inspiration, $veeplet, $_prompt ) {
        $max = 30;

        $chain_input = $veeplet['prompts']['chain'];
        $chain = Veepdotai_Util::get_chain( $chain_input );
        self::log( __METHOD__ . ": chain_input: " . print_r( $chain_input, true )
                    . " => chain: " . print_r( $chain, true ));
        
        // Replace {{inspiration}} placeholder
        $prompt = preg_replace("/(\{\{inspiration\}\})/", "$inspiration", $_prompt);
        $done = false;

        // Replace g* placeholders
        //for($i = 0; $i < $max && ! $done; $i++) {
        for( $i = 0; $i < count( $chain ) && ! $done; $i++ ) {
            $label = $chain[$i];
            $label_encoded = Veepdotai_Util::encode_prompt_id( $label );
            self::log( __METHOD__ . ": processing: $label/$label_encoded");

            //$phase_string = "ai-section-edcal1-phase$i";
            $phase_name = "ai-section-edcal1-phase${label_encoded}";
            $phase = Veepdotai_Util::get_option( $phase_name );
            self::log( __METHOD__ . ": processing: $phase_name/$phase");
            if ( $phase ) {
                self::log( __METHOD__ . ": intermediary results: $label/$label_encoded/$phase");
    
                $prompt = preg_replace("/(\{\{$label\}\})/", "$phase", $prompt);
                self::log( __METHOD__ . ": prompt: $prompt.");    
            } else {
                $done = true;
            }
        }

        return $prompt;
    }

    /**
     * Variables, computed from previous transformations, are replaced in new prompts.
     * While the *-phase$i is not null, substitution continues at least 10 times
     */
    public static function generate_text( $pid, $veeplet, $instructions, $idea = null ) {
        // We could imagine to restrict the number of phases according the user subscription
        $inspiration = Veepdotai_Util::get_option('ai-section-edcal0-transcription');
        self::log( __METHOD__ . ": inspiration: $inspiration.\n" );

        $_prompt = $instructions['prompt'];

        $prompt = self::replace_placeholders( $inspiration, $veeplet, $_prompt );
        self::log( __METHOD__ . ": transformed (strtr) prompt: " . $prompt );

        self::log( __METHOD__ . ": getting content from AI.");
        //$params = $prompt; // will default to davinci-003
        $role = isset( $instructions['role'] ) ? $instructions['role'] : "You are a helpful assistant";
        $llm = isset( $instructions['llm'] ) ? $instructions['llm'] : "";
        self::log( __METHOD__ . ": llm: ${llm}.");

        $result = [];
        if ( $llm ) {
            preg_match("/([^-]*)-(.*)/", $llm, $result );
            array_slice( $result, 0, 2);
            self::log( __METHOD__ . ": result: " . print_r( $result, true ) );
        }
        
        if ( ! $result ) {
            $result = ["", "openai", "gpt-4-0125-preview"];
        }

        $llm_engine = $result[1];
        if ( ! in_array( $llm_engine, ["openai", "mistral"])) {
            $result = ["", "openai", "gpt-4-0125-preview"];
            //throw new Exception("LLM engine ${llm_engine} is not among the allowed values.");
        }

        $llm_model = $result[2];
        if ( $llm_model == "gpt-4" ) {
            $llm_model = "gpt-4-0125-preview";
        }

        if ( ! in_array( $llm_model, [
                "gpt-4-1106-preview", "gpt-4-0125-preview",
                "mistral-tiny", "mistral-small", "mistral-medium"
            ])) {

            $result = ["", "openai", "gpt-4-0125-preview"];
            //throw new Exception("LLM model ${llm_model} is not among the allowed values.");
        }

        if ( $llm_engine == "openai" ) {
			$llm_ai_key = Veepdotai_Util::get_option( 'openai-api-key' );
		} else {
			$llm_ai_key = Veepdotai_Util::get_option( 'mistral-api-key' );
		}

        $temperature = isset( $instructions['temperature'] ) ? $instructions['temperature'] : 0.7;
        $max_tokens = isset( $instructions['max_tokens'] ) ? $instructions['max_tokens'] : 4096;
        $frequency_penalty = isset( $instructions['frequency_penalty'] ) ? $instructions['frequency_penalty'] : 0;
        $presence_penalty = isset( $instructions['presence_penalty'] ) ? $instructions['presence_penalty'] : 0.6;
        $top_p = isset( $instructions['top_p'] ) ? $instructions['top_p'] : 0.6;

        // model = default model is gpt-4-1106-preview for openai
        // model = default model is mistral-tiny for mistral
        $params = [
            'llm' => $llm_engine,
            'model' => $llm_model,

            'role' => $role,
            'messages' => $prompt,

            'temperature' => $temperature ? $temperature : 0.7,
            'max_tokens' => $max_tokens ? $max_tokens : 4096,
            'frequency_penalty' => $frequency_penalty ? $frequency_penalty : 0,
            'presence_penalty' => $presence_penalty ? $presence_penalty : 0.6
        ];
        $raw = Veepdotai_Util::get_content_from_ai( $llm_engine, $params, $llm_ai_key );

        self::log(  __METHOD__ . ": raw: " . print_r($raw, true) );

        $id = Veepdotai_Util::store_data( $raw, 'edcal-article-raw-0.json', $pid );

        return json_decode( $raw );
    }

    /**
     * Saves information about generation:
     * - generated content
     * - generation details
     * It is not necessary to store the encoded label because the prompt is stored
     * with the content and is used to inspect the content. The prompt order is then the
     * same that it was when executed.
     */
    public static function save_generation_bak( $id, $title, $result, $content, $res, $prefix, $i, $label_encoded ) {
        //unset($res->choices[0]->message->content);
        $post_array = array(
            "ID" => $id,
            //"post_title" => $title || date_create(),
            "post_content" => $result,
            "meta_input" => array(
                //"${prefix}${i}Content" => $label_encoded . "\n" . $content,
                "${prefix}${i}Content" => $content,
                "${prefix}${i}Details" => json_encode( $res ),
                "veepdotaiLastStepDone" => $i,
            )
        );
        self::log( __METHOD__ . ": post_array: " . print_r( $post_array, true ) );
        $id = wp_update_post( $post_array );

        return $id;
    }

    public static function save_generation( $id, $title, $result, $content, $res, $prefix, $i, $label_encoded ) {
        //unset($res->choices[0]->message->content);

        self::log( __METHOD__ . ": content: " . print_r( $content, true ) );
        $extracted = substr($content, 0, 20);
        self::log( __METHOD__ . ": extracted: " . print_r( $extracted, true ) );
        $computed_title = Veepdotai\Misc\Encoding\fixUTF8($extracted);
        self::log( __METHOD__ . ": computed_title: " . print_r( $computed_title, true ) );

        $post_array = array(
            "post_type" => GENERATED_CONTENT,
            "post_title" => $computed_title,
            "post_content" => $content,
            "post_parent" => $id,
            "meta_input" => array(
                //"${prefix}${i}Content" => $label_encoded . "\n" . $content,
                "veepdotaiContent" => $content,
                "veepdotaiDetails" => json_encode( $res ),
                "veepdotaiParent" => $id,
            )
        );
        self::log( __METHOD__ . ": child post_array: " . print_r( $post_array, true ) );
        $content_id = wp_insert_post( $post_array );

        // Doesn't need a post type because the item already exists
        $post_array = array(
            "ID" => $id,
            //"post_title" => $title || date_create(),
            "post_content" => $result,
            "meta_input" => array(
                "veepdotaiLastStepDone" => $i,
            )
        );
        self::log( __METHOD__ . ": parent post_array: " . print_r( $post_array, true ) );
        $id = wp_update_post( $post_array );

        return $content_id;
        //return $id;
    }
    
}