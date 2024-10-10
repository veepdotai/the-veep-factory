<?php

if ( ! defined( 'ABSPATH' ) ) exit;

Class Veepdotai_Form {

	public static function init_nonce() {
		$pn = VEEPDOTAI_PLUGIN_NAME;

		return wp_kses_post( wp_nonce_field( $pn ) );
		// return wp_kses_post ( wp_nonce_field( $pn . '-main_admin_site', $pn . '-main_admin_site_nonce' ) );
	}

	public static function get_roles() {
		$user         = wp_get_current_user();
		$roles        = (array) $user->roles;
		$roles_string = implode( ' ', $roles );

		return $roles_string;
	}

	public static function generate_help_html_from_markdown( $page ) {
		$lang = Veepdotai_Util::get_language();
		if ( ! preg_match( '/^fr_/', $lang ) ) {
			$lang = 'en_EN';
		} else {
			$lang = 'fr_FR';
		}

		$user      = wp_get_current_user();
		$role_page = '';
		if ( in_array( 'veepdotai_role_user', $user->roles ) ) {
			$role_page = 'veepdotai_role_user';
		}

		// Some pages are specialized for a specific role
		$final_page = $page . '-' . $role_page . '-' . $lang . '.md';
		if ( file_exists( VEEPDOTAI_PLUGIN_DIR . '/admin/help/' . $final_page ) ) {
			$markdown_content = file_get_contents( VEEPDOTAI_PLUGIN_DIR . '/admin/help/' . $final_page );
		} else {
			$final_page       = $page . '-' . $lang . '.md';
			$markdown_content = file_get_contents( VEEPDOTAI_PLUGIN_DIR . '/admin/help/' . $final_page );
		}

		$content = Veepdotai_Util::generate_html_from_markdown( $markdown_content );

		return $content;
	}

	public static function generate_help_image( $page ) {
		$content    = self::generate_help_html_from_markdown( $page );
		?>
			<div id="help">
				<a href="#help-content" rel="modal:open">
					<img class="help-icon" src="<?php echo esc_url( plugins_url() . '/' . VEEPDOTAI_PLUGIN_NAME . '/admin/images/help-support.256.png' ); ?>" />
				</a>
				<div id="help-content" class="modal">
					<?php echo( wp_kses_post( $content ) ); ?>
					<input id="closeModal" type="button" onclick="jQuery.modal.close()" value="Close">
				</div>
			</div>
		<?php
	}

	public static function generate_title( $title ) {
		?>
		<h2>
			<?php echo( esc_html( get_admin_page_title() . '/' . $title ) ); ?>
		</h2>
		<?php
	}

	public static function generate_switch_mode() {
		//if ( in_array( 'veepdotai_role_admin', wp_get_current_user()->roles ) ) {
			?>
				<div id="toggle_div">
					<label class="switch">
						<input type="checkbox" checked onclick="toggleMode()">
						<span class="slider round"></span>'
					</label>
					<span>Beginner/Expert</span>
				</div>
			<?php
		//}
	}

	public static function generate_inline_help( $content ) {
		?>
		<div id="inline_help">
			<?php echo wp_kses_post( Veepdotai_Util::generate_html_from_markdown( $content, false) );?>
		</div>
		<?php
	}

	public static function generate_button_escaped( $pn, $button_id, $button_name ) {
		?>
		<input class="button-primary"
				type="submit"
				name="<?php echo( esc_attr( $pn . '-' . $button_id ) ); ?>"
				value="<?php echo( esc_attr( $button_name ) ); ?>"
		>
		<?php
	}

	public static function generate_tabs($questions) {
		?>
		<ul class="tabs_questions">
		<?php
			// A more generic tabs should have been better...
			$list_items = '';
			foreach ( $questions as $key => $label ) {
				?>
				<li id="<?php echo( esc_attr( 'veep_id_' . $key . '_menu' ) ); ?>"
					onclick="toggle_display('<?php echo( esc_js( 'veep_id_' . $key ) ); ?>')" >
					<?php echo( esc_html( $label ) ); ?>
				</li>
				<?php
			}
		?>
		</ul>
		<?php
	}

	public static function generate_tabs_escaped() {
		$questions = array(
			'benefits'  => 'Bénéfices',
			'pains'     => __( 'Pains' ),
			'solutions' => __( 'Solutions' ),
			'strengths' => __( 'Strengths' ),
		);

		self::generate_tabs($questions);
	}

	public static function display_escaped( bool $enable_voice, string $legend, string $field_name, string $_type, bool $in_section = false ) {
		$pn         = VEEPDOTAI_PLUGIN_NAME;
		?>
		
		<?php
		if ( $enable_voice ) {
			?>
				<legend><?php echo( esc_html( $legend ) ); ?></legend>
				<label for="<?php echo( esc_attr( $field_name ) ); ?>"></label>

				<div id="<?php echo( esc_attr( 'controls-' . $field_name ) ); ?>">
					<button id="recordButton">Record</button>
					<button id="pauseButton" disabled>Pause</button>
					<button id="stopButton" disabled>Stop</button>
				</div>
				<div id="formats">Format: start recording to see sample rate</div>
				<p><strong>Recordings:</strong></p>
				<ol id="recordingsList"></ol>
			<?php
		}

		$fieldform  = '';
		$fieldstyle = '';
		$value      = Veepdotai_Util::get_option( $field_name );

		$type  = 'type="' . esc_attr( ( $_type == 'img' ? 'url' : 'text' ) ) . '"';
		$id    = 'id="' . esc_attr( $pn . '-' . $field_name ) . '"';
		$name  = 'name="' . esc_attr( $pn . '-' . $field_name ) . '"';
		$class = 'class="' . esc_attr( $pn . '-' . $field_name ) . '"';

		$common_attrs_escaped = "$id $type $name $class";

		?>

		<fieldset>
			<legend><?php echo( esc_html( $legend ) ); ?></legend>
			<label for="<?php echo( esc_attr( $field_name ) ); ?>"></label>

		<?php

		if ( $_type == 'textarea' ) {
			?>
				<textarea
					id="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					name="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					class="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					style="width: 100%; height: 200px;"
					><?php echo( esc_textarea( $value ) ); ?></textarea>
			<?php
		} else {
			?>
				<input
					id="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					name="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					class="<?php echo( esc_attr( $pn . '-' . $field_name ) ); ?>"
					style="width: 100%;"
					value="<?php echo( esc_attr( $value ) ); ?>"
				/>
			<?php
		}
		?>

		</fieldset>
		
		<?php
	}

	public static function generate_context( $context ) {
		?>
		<div>
			<p id="context" class="context">
				<?php echo( wp_kses_post( $context ) ); ?>
			</p>
		</div>
		<?php
	}
}
