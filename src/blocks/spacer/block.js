/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from './icon';
import ResizableBox from 're-resizable';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
	createBlock,
} = wp.blocks;
const {
	InspectorControls,
	ColorPalette,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} = wp.editor;
const {
	Fragment,
} = wp.element;
const {
	PanelColor,
	PanelBody,
	ToggleControl,
	RangeControl,
	SelectControl,
} = wp.components;

function kadenceHexToRGB(hex, alpha) {
	hex = hex.replace('#', '');
	let r = parseInt( hex.length == 3 ? hex.slice (0, 1 ).repeat(2) : hex.slice( 0, 2 ), 16 );
	let g = parseInt( hex.length == 3 ? hex.slice( 1, 2 ).repeat(2) : hex.slice( 2, 4 ), 16 );
	let b = parseInt( hex.length == 3 ? hex.slice( 2, 3 ).repeat(2) : hex.slice( 4, 6 ), 16 );
	let alp;
	if ( alpha < 10 ) {
		alp = '0.0' + alpha;
	} else if ( alpha >= 100 ) {
		alp = '1';
	} else {
		alp = '0.' + alpha;
	}
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alp + ')';
}
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/spacer', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Spacer/Divider' ), // Block title.
	icon: {
		src: icons.block,
	},
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'spacer' ),
		__( 'divider' ),
		__( 'KT' ),
	],
	attributes: {
		blockAlignment: {
			type: 'string',
			default: 'center',
		},
		hAlign: {
			type: 'string',
			default: 'center',
		},
		spacerHeight: {
			type: 'number',
			default: 60,
		},
		dividerEnable: {
			type: 'boolean',
			default: true,
		},
		dividerStyle: {
			type: 'string',
			default: 'solid',
		},
		dividerOpacity: {
			type: 'number',
			default: 100,
		},
		dividerColor: {
			type: 'string',
			default: '#eee',
		},
		dividerWidth: {
			type: 'number',
			default: 80,
		},
		dividerHeight: {
			type: 'number',
			default: 1,
		},
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/spacer' ],
				transform: ( { height } ) => {
					return createBlock( 'kadence/spacer', {
						spacerHeight: height,
						divider: false,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/separator' ],
				transform: () => {
					return createBlock( 'kadence/spacer', {
						spacerHeight: 30,
						divider: true,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/spacer' ],
				transform: ( { spacerHeight } ) => {
					return createBlock( 'core/spacer', {
						height: spacerHeight,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/separator' ],
				transform: () => {
					return createBlock( 'core/separator' );
				},
			},
		],
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ('full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit: props => {
		const { attributes: { blockAlignment, spacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth, hAlign }, className, setAttributes, toggleSelection } = props;
		const dividerBorderColor = ( ! dividerColor ?  kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
		return (
			<div className={ className }>
				<BlockControls key='controls'>
					<BlockAlignmentToolbar
						value={ blockAlignment }
						controls={ [ 'center', 'wide', 'full' ] }
						onChange={ blockAlignment => setAttributes( { blockAlignment } ) }
					/>
					<AlignmentToolbar
						value={ hAlign }
						onChange={ hAlign => setAttributes( { hAlign } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody
						title={ __( 'Spacer Settings' ) }
						initialOpen={ true }
					>
						<RangeControl
							label={ __( 'Height' ) }
							value={ spacerHeight }
							onChange={ spacerHeight => setAttributes( { spacerHeight } ) }
							min={ 6 }
							max={ 600 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Divider Settings' ) }
						initialOpen={true}
					>
						<PanelBody>
							<ToggleControl
								label={ __( 'Enable Divider' ) }
								checked={ dividerEnable }
								onChange={ dividerEnable => setAttributes( { dividerEnable } ) }
							/>
						</PanelBody>
						<SelectControl
							label={ __( 'Divider Style' ) }
							value={ dividerStyle }
							options={ [
								{ value: 'solid', label: __( 'Solid' ) },
								{ value: 'dashed', label: __( 'Dashed' ) },
								{ value: 'dotted', label: __( 'Dotted' ) },
							] }
							onChange={ dividerStyle => setAttributes( { dividerStyle } ) }
						/>
						<PanelColor
							title={ __( 'Divider Color' ) }
							colorValue={ dividerColor }
						>
							<ColorPalette
								value={ dividerColor }
								onChange={ dividerColor => setAttributes( { dividerColor } ) }
							/>
						</PanelColor>
						<RangeControl
							label={ __( 'Divider Opacity' ) }
							value={ dividerOpacity }
							onChange={ dividerOpacity => setAttributes( { dividerOpacity } ) }
							min={ 0 }
							max={ 100 }
						/>
						<RangeControl
							label={ __( 'Divider Height in px' ) }
							value={ dividerHeight }
							onChange={ dividerHeight => setAttributes( { dividerHeight } ) }
							min={ 0 }
							max={ 40 }
						/>
						<RangeControl
							label={ __( 'Divider Width by %' ) }
							value={ dividerWidth }
							onChange={ dividerWidth => setAttributes( { dividerWidth } ) }
							min={ 0 }
							max={ 100 }
						/>
					</PanelBody>
				</InspectorControls>
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` }>
					{ dividerEnable && (
						<hr class="kt-divider" style={ {
							borderTopColor: dividerBorderColor,
							borderTopWidth: dividerHeight + 'px',
							width: dividerWidth + '%',
							borderTopStyle: dividerStyle,
						} } />
					) }
					<ResizableBox
						size={ {
							height: spacerHeight,
						} }
						minHeight="20"
						handleClasses={ {
							top: 'kadence-spacer__resize-handler-top',
							bottom: 'kadence-spacer__resize-handler-bottom',
						} }
						enable={ {
							top: false,
							right: false,
							bottom: true,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						} }
						onResizeStop={ ( event, direction, elt, delta ) => {
							setAttributes( {
								spacerHeight: parseInt( spacerHeight + delta.height, 10 ),
							} );
							toggleSelection( true );
						} }
						onResizeStart={ () => {
							toggleSelection( false );
						} }
					/>
				</div>
			</div>
		);
	},

	save: props => {
		const { attributes: { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth } } = props;
		const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
		return (
			<div className={ `align${ blockAlignment }` }>
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` } style={ {
					height: spacerHeight + 'px',
				} } >
					{ dividerEnable && (
						<hr class="kt-divider" style={ {
							borderTopColor: dividerBorderColor,
							borderTopWidth: dividerHeight + 'px',
							width: dividerWidth + '%',
							borderTopStyle: dividerStyle,
						} } />
					) }
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				blockAlignment: {
					type: 'string',
					default: 'center',
				},
				hAlign: {
					type: 'string',
					default: 'center',
				},
				spacerHeight: {
					type: 'number',
					default: '60',
				},
				dividerEnable: {
					type: 'boolean',
					default: true,
				},
				dividerStyle: {
					type: 'string',
					default: 'solid',
				},
				dividerOpacity: {
					type: 'number',
					default: '100',
				},
				dividerColor: {
					type: 'string',
					default: '#eee',
				},
				dividerWidth: {
					type: 'number',
					default: '80',
				},
				dividerHeight: {
					type: 'number',
					default: '1',
				},
			},
			save: ( { attributes } ) => {
				const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth } = attributes;
				const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
				return (
					<div className={ `align${ blockAlignment }` }>
						<div class="kt-block-spacer" style={ {
							height: spacerHeight + 'px',
						} } >
							{ dividerEnable && (
								<hr class="kt-divider" style={ {
									borderTopColor: dividerBorderColor,
									borderTopWidth: dividerHeight + 'px',
									width: dividerWidth + '%',
									borderTopStyle: dividerStyle,
								} } />
							) }
						</div>
					</div>
				);
			},
		},
	],
} );
