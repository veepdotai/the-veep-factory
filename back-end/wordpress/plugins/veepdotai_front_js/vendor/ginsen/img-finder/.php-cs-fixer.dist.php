<?php

/**
 * @see https://cs.symfony.com/
 * @see https://cs.symfony.com/doc/config.html
 * @see https://cs.symfony.com/doc/rules/index.html
 */

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude(['bin', 'config', 'etc', 'public', 'var'])
    ->ignoreVCS(true)
    ->files()
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'align_multiline_comment' => true,
        'array_syntax' => ['syntax' => 'short'],
        'binary_operator_spaces' => ['operators' => [
            '='  => 'align_single_space',
            '=>' => 'align_single_space',
        ]],
        'blank_line_before_statement' => true,
        'combine_consecutive_unsets' => true,
        'concat_space' => ['spacing' => 'one'],
        'general_phpdoc_annotation_remove' => ['annotations' => ['expectedException', 'expectedExceptionMessage', 'expectedExceptionMessageRegExp']],
        'heredoc_to_nowdoc' => true,
        'list_syntax' => ['syntax' => 'short'],
        'no_extra_blank_lines' => ['tokens' => ['break', 'continue', 'return', 'throw', 'use', 'parenthesis_brace_block', 'square_brace_block', 'curly_brace_block']],
        'no_null_property_initialization' => true,
        'echo_tag_syntax' => true,
        'no_superfluous_elseif' => true,
        'no_unneeded_curly_braces' => true,
        'no_unneeded_final_method' => true,
        'no_unreachable_default_argument_value' => true,
        'no_useless_else' => true,
        'no_useless_return' => true,
        'ordered_class_elements' => false,
        'ordered_imports' => true,
        'php_unit_strict' => true,
        'phpdoc_add_missing_param_annotation' => true,
        'phpdoc_order' => true,
        'semicolon_after_instruction' => true,
        'single_line_comment_style' => true,
        'strict_comparison' => false,
        'strict_param' => false,
        'no_superfluous_phpdoc_tags' => false,
        'declare_strict_types' => true,
        'class_attributes_separation' => false,
        'phpdoc_separation' => false,
        'phpdoc_align' => false,
        'php_unit_test_annotation' => ['style' => 'annotation'],
        'php_unit_method_casing' => ['case' => 'snake_case'],
    ])
    ->setFinder($finder)
;
