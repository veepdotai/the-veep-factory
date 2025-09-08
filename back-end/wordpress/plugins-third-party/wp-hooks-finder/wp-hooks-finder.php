<?php
/**
 * Plugin Name: WP Hooks Finder
 * Version: 1.3.1
 * Description: Easily enable/disable hooks and filters which are running in the page. A menu "WP Hooks Finder" will be added in your wordpress admin bar menu where you can display all the hooks and filters
 * Author: Muhammad Rehman
 * Author URI: https://muhammadrehman.com/
 * License: GPLv2 or later
 * Text Domain: wphf_domain
 */

define( 'WPHF_PLUGIN_PATH', plugin_dir_url( __FILE__ ) );
define( 'WPHF_PLUGIN_VERSION', '1.3.1' );

Class WP_Hooks_Finder {

    private $filter_hook_active = false;

    private $recent_hooks = array();

    function __construct() {
        add_action( 'wp_enqueue_scripts', array( $this, 'wphf_style' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'wphf_style' ) );
        add_action('admin_bar_menu', array( $this, 'wphf_add_toolbar_items' ), 99 );
        add_action( 'all', array( $this, 'wphf_display_all_hooks' ),100 );
    }

    /**
    * Adding style
    * 
    * @since 1.0
    * @version 1.0
    */
    public function wphf_style() {

        
        wp_enqueue_style( 'wphf-style', WPHF_PLUGIN_PATH . 'assets/css/style.css' );
        if( ( isset( $_GET['wphf'] ) && $_GET['wphf'] == 1 ) || 
        ( isset( $_GET['wphfa'] ) && $_GET['wphfa'] == 1 ) || 
        ( isset( $_GET['wphff'] ) && $_GET['wphff'] == 1 ) )  {
            
            wp_enqueue_style( 'wphf-style-hook', WPHF_PLUGIN_PATH . 'assets/css/hooks-style.css' );
            wp_enqueue_script( 'wphf-script-hook', WPHF_PLUGIN_PATH . 'assets/js/script.js', array(), WPHF_PLUGIN_VERSION, true );
        }
    }

    /**
     * Adding menu in the Admin Bar Menu
     * 
     * @since 1.0
     * @version 1.2
     */


    function wphf_add_toolbar_items( $admin_bar ){

        if( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $page_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

        $page_url = $this->wphf_clean_url($page_url);
        $page_request = parse_url( $page_url );

        $admin_bar->add_menu( array(
            'id'    => 'wp-hooks-finder',
            'title' => __('WP Hooks Finder', 'wphf_domain'),
            'href'  => '#',
            'meta'  => array(
                'title' => __('WP Hooks Finder', 'wphf_domain'),      
            ),
        ));
        $admin_bar->add_menu( array(
            'id'    => 'enable-disable-hooks',
            'parent' => 'wp-hooks-finder',
            'title' => $this->wphf_is_active( 'wphf', 'All Action & Filter ' ),
            'href'  => $this->wphf_is_url( $page_url, $page_request, 'wphf' ),
            'meta'  => array(
                'title' => $this->wphf_is_active( 'wphf', 'All Action & Filter ' ),
                // 'target' => '_blank',
                'class' => 'wphf-menu'
            ),
        ));
        $admin_bar->add_menu( array(
            'id'    => 'enable-disable-action-hooks',
            'parent' => 'wp-hooks-finder',
            'title' => $this->wphf_is_active( 'wphfa', 'Action' ),
            'href'  => $this->wphf_is_url( $page_url, $page_request, 'wphfa' ),
            'meta'  => array(
                'title' => $this->wphf_is_active( 'wphfa', 'Action' ),
                // 'target' => '_blank',
                'class' => 'wphf-menu'
            ),
        ));
        $admin_bar->add_menu( array(
            'id'    => 'enable-disable-filter-hooks',
            'parent' => 'wp-hooks-finder',
            'title' => $this->wphf_is_active( 'wphff', 'Filter' ),
            'href'  => $this->wphf_is_url( $page_url, $page_request, 'wphff' ),
            'meta'  => array(
                'title' => $this->wphf_is_active( 'wphff', 'Filter' ),
                // 'target' => '_blank',
                'class' => 'wphf-menu'
            ),
        ));
    }

    /**
     * Return the URL depending on the request
     */
    function wphf_is_url( $page_url, $page_request, $id ) {

        if( isset( $_GET[$id] ) && $_GET[$id] == 1 ) {
            $link = $page_url . ( isset( $page_request['query'] ) ? '&' : '?' ) . $id . '=0';
        } else {
            $link = $page_url . ( isset( $page_request['query'] ) ? '&' : '?' ) . $id . '=1';
        }

        return $link;
    }

    /**
     * Return what title should be render on menu
     */
    function wphf_is_active( $id, $title ) {

        if( isset( $_GET[$id] ) && $_GET[$id] == 1 ) {
            return sprintf( __( 'Hide %s Hooks', 'wphf_domain' ), $title );
        } else {
            return sprintf( __( 'Show %s Hooks', 'wphf_domain' ), $title );
        }
    }

    /**
     * Reset the URL
     */
    function wphf_clean_url( $url ) {

        $query_url = array( '?wphf=1', '?wphf=0', '&wphf=0', '&wphf=1', '?wphfa=1', '?wphfa=0', '&wphfa=0', '&wphfa=1', '?wphff=1', '?wphff=0', '&wphff=0', '&wphff=1' );

        foreach( $query_url as $q_url ) {
            if( strpos(  $url, $q_url ) !== false ) {
                $clean_url = str_replace( $q_url, '',$url );
                return $clean_url;            
            }
        }

        return $url;
    }

    /**
     * WordPress action hook "all", which is responsible to display hooks & filters
     * 
     * @since 1.0
     * @version 1.0
     */
    function wphf_display_all_hooks( $tag ) {

        
        global $wp_actions, $wp_filter, $debug_tags;

        $search_for = 'none';
        if( isset( $_GET['wphf'] ) && $_GET['wphf'] == 1 ) {

            $search_for = 'all';
        } else if( isset( $_GET['wphfa'] ) && $_GET['wphfa'] == 1 ) {

            $search_for = 'action';
            // echo "<div id='wphf-action' title=' Action Hook'><img src='".WPHF_PLUGIN_PATH."assets/img/action.png' />" . '<a href="https://www.google.com/search?q='.$tag.'&btnI" target="_blank">'.$tag.'</a>' . "</div>";
        } else if( isset( $_GET['wphff'] ) && $_GET['wphff'] == 1 ) {
            $search_for = 'filter';
            // echo "<div id='wphf-filter' title='Filter Hook'><img src='".WPHF_PLUGIN_PATH."assets/img/filter.png' />" . '<a href="https://www.google.com/search?q='.$tag.'&btnI" target="_blank">' . $tag . '</a>' . "</div>";
        }

        // if( ( !isset( $_GET['wphf'] ) || $_GET['wphf'] == 0 ) &&
        // ( !isset( $_GET['wphfa'] ) || $_GET['wphfa'] == 0 ) &&
        // ( !isset( $_GET['wphff'] ) || $_GET['wphff'] == 0 ) ) return;

        // if ( ! in_array( $tag, $action_hooks ) && ! in_array( $tag, $filter_hooks ) ) {

            if ( isset( $wp_actions[$tag] ) ) {
                        
                // if( !isset( $wp_hooks ) ) {
                //     $wp_hooks = array();
                // }

                // Action
                $wp_hooks[] = array(
                    'ID'       => $tag,
                    'callback' => false,
                    'type'     => 'action',
                );
            }
            else {
                
                // if( !isset( $wp_hooks ) ) {
                //     $wp_hooks = array();
                // }

                if( $tag == 'the_title' ) {
                    $this->filter_hook_active = true;
                }

                if( $this->filter_hook_active == true ) {

                    if( !in_array( $tag, $this->recent_hooks ) ) {

                        // Filter
                        $wp_hooks[] = array(
                        'ID'       => $tag,
                        'callback' => false,
                        'type'     => 'filter',
                        );

                        $this->recent_hooks[] = $tag;
                    }
                }
            }
        // }

        // echo '<pre>';
        // print_r($wp_filter);
        // echo '</pre>';

        // if ( isset( $wp_actions[$tag] ) ) {
            if( isset( $wp_hooks ) && is_array( $wp_hooks ) ) {
                foreach ( $wp_hooks as $nested_value ) {
                    // die('tata3');

                    if( $search_for == 'all' ) {
                        $this->render_action( $nested_value );
                    } else if ( $search_for == $nested_value['type'] ) {
                        // die('oo');
                        // var_dump($nested_value);
                        $this->render_action( $nested_value );
                    }
                    // render_action( $nested_value );
                }

            }
        // }
        

        
        if( !isset( $debug_tags ) )
            $debug_tags = array();

        if ( in_array( $tag, $debug_tags ) ) {
            return;
        }

        

        $debug_tags[] = $tag;
    }

    /**
	 *
	 * Render action
	 */
	function render_action( $args = array() ) {
		global $wp_filter;
		
		// Get all the nested hooks
		$nested_hooks = ( isset( $wp_filter[ $args['ID'] ] ) ) ? $wp_filter[ $args['ID'] ] : false ;
		
		// Count the number of functions on this hook
		$nested_hooks_count = 0;
		if ( $nested_hooks ) {
			foreach ($nested_hooks as $key => $value) {
				$nested_hooks_count += count($value);
			}
		}
		?>
		<span style="display:none;" data-tag="<?php echo $args['ID'];?>" class="wphf-hook wphf-hook-<?php echo $args['type'] ?> <?php echo ( $nested_hooks ) ? 'wphf-hook-has-hooks' : '' ; ?>" >
			
			<?php
			if ( 'action' == $args['type'] ) {
				?>
				<span class="wphf-hook-type wphf-hook-type"><img src="<?php echo WPHF_PLUGIN_PATH.'assets/img/action.png';?>" width="10"/></span>
				<?php
			}
			else if ( 'filter' == $args['type'] ) {
				?>
				<span class="wphf-hook-type wphf-hook-type"><img src="<?php echo WPHF_PLUGIN_PATH.'assets/img/filter.png';?>" width="10"/></span>
				<?php
			}
			?>
			
			<?php
			
			// Main - Write the action hook name.
			//echo esc_html( $args['ID'] );
			echo $args['ID'];
			
			// @TODO - Caller function testing.
			if ( isset( $extra_data[1] ) && FALSE !== $extra_data[1] ) {
				foreach ( $extra_data as $extra_data_key => $extra_data_value ) {
					echo '<br />';
					echo $extra_data_value['function'];
				}
			}
			
			// Write the count number if any function are hooked.
			if ( $nested_hooks_count ) {
				?>
				<span class="wphf-hook-count">
					<?php echo $nested_hooks_count ?>
				</span>
				<?php
			}
			
			// Write out list of all the function hooked to an action.
			if ( isset( $wp_filter[$args['ID']] ) ):
				
				$nested_hooks = $wp_filter[$args['ID']];
				
				if ( $nested_hooks ):
					?>
					<ul class="wphf-hook-dropdown">
                        
						<li class="wphf-hook-heading">
                            
							<strong><?php echo $args['type'] ?>:</strong> <?php echo $args['ID']; ?>
						</li>
						
						<?php
						foreach ( $nested_hooks as $nested_key => $nested_value ) :
							
							// Show the priority number if the following hooked functions
							?>
							<li class="wphf-priority">
								<span class="wphf-priority-label"><strong><?php echo 'Priority:'; /* _e('Priority', 'simply-show-hooks') */ ?></strong> <?php echo $nested_key ?></span>
							</li>
							<?php
							
							foreach ( $nested_value as $nested_inner_key => $nested_inner_value ) :
								
								// Show all teh functions hooked to this priority of this hook
								?>
								<li>
									<?php
									if ( $nested_inner_value['function'] && is_array( $nested_inner_value['function'] ) && count( $nested_inner_value['function'] ) > 1 ):
										
										// Hooked function ( of type object->method() )
										?>
										<span class="wphf-function-string">
											<?php
											$classname = false;
											
											if ( is_object( $nested_inner_value['function'][0] ) || is_string( $nested_inner_value['function'][0] ) ) {
												
												if ( is_object( $nested_inner_value['function'][0] ) ) {
													$classname = get_class($nested_inner_value['function'][0] );
												}
												
												if ( is_string( $nested_inner_value['function'][0] ) ) {
													$classname = $nested_inner_value['function'][0];
												}
												
												if ( $classname ) {
													?><?php echo $classname ?>&ndash;&gt;<?php
												}
											}
											?><?php echo $nested_inner_value['function'][1] ?>
										</span>
										<?php
									else :
										
										// Hooked function ( of type function() )
										?>
										<span class="wphf-function-string">
											<?php echo $nested_inner_key ?>
										</span>
										<?php
									endif;
									?>
									
								</li>
								<?php
								
							endforeach;
							
						endforeach;
						?>
						
					</ul>
					<?php
				endif;
				
			endif;
			?>
		</span>
		<?php
	}

}

$WP_Hooks_Finder = new WP_Hooks_Finder();
