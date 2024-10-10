<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div class="wrap <?php esc_attr_e( 'veepdotai-main-admin-settings' ); ?>">

	<?php Veepdotai_Form::generate_title( __( 'Settings', 'veepdotai' ) ); ?>

	<div class="veep_settings">
		<form id="veep_form_settings" method="post" action="">
			<input name="username" value="" placeholder="Type the username you want to switch to"/>
			<div class="veep_actions">
				<?php
					Veepdotai_Form::generate_button_escaped( $pn, 'ai-settings-reset-roles', __( 'Reset roles', 'veepdotai' ) );
					Veepdotai_Form::generate_button_escaped( $pn, 'ai-settings-create-roles', __( 'Create roles', 'veepdotai' ) );
					Veepdotai_Form::generate_button_escaped( $pn, 'ai-settings-set-current-user', __( 'Change user', 'veepdotai' ) );
				?>
			</div>
		</form>
	</div>
</div>
