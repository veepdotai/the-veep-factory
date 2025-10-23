<?php

if ( ! defined( 'ABSPATH' ) ) exit;

require 'veepdotai-form-functions.php';

class Veepdotai_Form_Configuration {

	public static function generate_configuration_form_section( $enable_voice, $intent, $section_title, int $num_section, $context = '' ) {

		?>
		<div id="<?php echo( esc_attr( 'veep_id_' . $intent ) ); ?>" class="veep_section">

			<label>
				<?php echo( esc_html( $section_title . ' [' . $num_section . ']' ) ); ?>
			</label>

			<p id="context-' . $num_section . '" class="veep_context">
				<?php echo( esc_html( $context ) ); ?>
			</p>

			<?php
				Veepdotai_Form::display_escaped( false, __( 'OpenAI API Key', 'veepdotai' ), 'openai-api-key', 'text', true );
				self::display_hint( 'https://platform.openai.com/account/api-keys' );

				Veepdotai_Form::display_escaped( false, __( 'MistralAI API Key', 'veepdotai' ), 'mistral-api-key', 'text', true );
				self::display_hint( 'https://console.mistral.ai/user/api-keys/' );

				Veepdotai_Form::display_escaped( false, __( 'Pexels API Key', 'veepdotai' ), 'pexels-api-key', 'text', true );
				self::display_hint( 'https://www.pexels.com/fr-fr/api/new/' );
				
				Veepdotai_Form::display_escaped(false, __('Unsplash API Key', 'veepdotai'), 'unsplash-api-key', 'text', true);
				self::display_hint( 'https://unsplash.com/developers' );

				Veepdotai_Form::display_escaped(false, __('Default Veep.AI username', 'veepdotai'), 'default-username', 'text', true);
				Veepdotai_Form::display_escaped(false, __('ffmpeg executable path', 'veepdotai'), 'ffmpeg', 'text', true);
			?>
		</div>
		<?php
	}

	public static function display_hint ( $href ) {
		?>
		<p>
			<?php echo( wp_kses_post( __( 'If you dont have one, <a href="" target="_blank">get an API Key</a>', 'veepdotai' ) ) ); ?>
		</p>
		<?php
	}

}