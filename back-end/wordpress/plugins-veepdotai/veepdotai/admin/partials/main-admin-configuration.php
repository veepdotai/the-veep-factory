<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div class="wrap <?php esc_attr_e( 'veepdotai-main-admin-configuration' ); ?>">

	<?php Veepdotai_Form::generate_title( __( 'Configure', 'veepdotai' ) ); ?>

	<ul>
		<li><?php echo( wp_kses_post( __( 'If you enjoy the plugin, we would really appreciate if you could <a href="https://wordpress.org/support/plugin/veep/reviews/" target="_blank">drop us a review</a> or support us with <a href="https://www.paypal.me/veep" target="_blank">a donation</a>', 'veepdotai' ) ) ); ?></li>
		<li><?php echo( wp_kses_post( __( 'If you find a bug or have any suggestion, create a <a href="https://wordpress.org/support/plugin/veep" target="_blank">new topic in the plugin support</a>', 'veepdotai' ) ) ); ?></li>
		<li><?php echo( wp_kses_post( __( 'If you need detailed information about the plugin, have a look at <a href="https://www.veep.ai/veep-user-guide/" target="_blank">the user guide</a>', 'veepdotai' ) ) ); ?></li>
	</ul>

	<div class="veep_configuration">
		<form id="veep_form" method="post" action="">
			<?php
				Veepdotai_Form_Configuration::generate_configuration_form_section( true, 'configuration', 'Configuration', 1 );
			?>

			<div class="veep_actions">
				<?php
					Veepdotai_Form::generate_button_escaped( $pn, 'ai-save', __( 'Save', 'veepdotai' ) );
					Veepdotai_Form::generate_button_escaped( $pn, 'ai-next', __( 'Next', 'veepdotai' ) );
				?>
			</div>
		</form>
	</div>
</div>
