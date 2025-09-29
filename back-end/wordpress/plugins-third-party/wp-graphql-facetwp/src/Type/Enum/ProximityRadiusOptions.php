<?php
/**
 * GraphQL Enum Type - ProximityRadiusOptions.
 *
 * @package WPGraphQL\FacetWP\Type\Enum
 * @since   0.4.0
 */

namespace WPGraphQL\FacetWP\Type\Enum;

use WPGraphQL\FacetWP\Vendor\AxeWP\GraphQL\Abstracts\EnumType;
use WPGraphQL\Type\WPEnumType;

/**
 * Class - ProximityRadiusOptions
 */
class ProximityRadiusOptions extends EnumType {
	/**
	 * {@inheritDoc}
	 */
	protected static function type_name(): string {
		return 'FacetProximityRadiusOptions';
	}

	/**
	 * {@inheritDoc}
	 */
	public static function get_description(): string {
		return __( 'Proximity radius options', 'wpgraphql-facetwp' );
	}

	/**
	 * {@inheritDoc}
	 */
	public static function get_values(): array {
		return [
			WPEnumType::get_safe_name( '10' )  => [
				'description' => static fn () => __( 'Radius of 10', 'wpgraphql-facetwp' ),
				'value'       => 10,
			],
			WPEnumType::get_safe_name( '25' )  => [
				'description' => static fn () => __( 'Radius of 25', 'wpgraphql-facetwp' ),
				'value'       => 25,
			],
			WPEnumType::get_safe_name( '50' )  => [
				'description' => static fn () => __( 'Radius of 50', 'wpgraphql-facetwp' ),
				'value'       => 50,
			],
			WPEnumType::get_safe_name( '100' ) => [
				'description' => static fn () => __( 'Radius of 100', 'wpgraphql-facetwp' ),
				'value'       => 100,
			],
			WPEnumType::get_safe_name( '250' ) => [
				'description' => static fn () => __( 'Radius of 250', 'wpgraphql-facetwp' ),
				'value'       => 250,
			],
		];
	}
}
