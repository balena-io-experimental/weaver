import { NodeDisplayData, PartialButFor, PlainObject } from 'sigma/types';
import { Settings } from 'sigma/settings';

const TEXT_COLOR = '#000000';

/**
 * This function draw in the input canvas 2D context a rectangle.
 * It only deals with tracing the path, and does not fill or stroke.
 */
export function drawRoundRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
): void {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

/**
 * Custom hover renderer
 */
export function drawHover(
	context: CanvasRenderingContext2D,
	data: PlainObject,
	settings: PlainObject,
) {
	const size = settings.labelSize;
	const font = settings.labelFont;
	const weight = settings.labelWeight;
	const subLabelSize = size - 2;

	const label = data.label;
	const importsLabel = `Imports: ${data.imports}`;
	const exportsLabel = `Exports: ${data.exports}`;
	const filePathLabel = `File path: ${data.filePathLabel}`;

	// Then we draw the label background
	context.beginPath();
	context.fillStyle = '#fff';
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 2;
	context.shadowBlur = 8;
	context.shadowColor = '#000';

	context.font = `${weight} ${size}px ${font}`;
	const labelWidth = context.measureText(label).width;
	context.font = `${weight} ${subLabelSize}px ${font}`;
	context.font = `${weight} ${subLabelSize}px ${font}`;
	const filePathLabelWidth = filePathLabel
		? context.measureText(filePathLabel).width
		: 0;

	const textWidth = Math.max(labelWidth, filePathLabelWidth);

	const x = Math.round(data.x);
	const y = Math.round(data.y);
	const w = Math.round(textWidth + size / 2 + data.size + 3);
	const hLabel = Math.round(size / 2 + 4);
	const hImports = data.imports ? Math.round(subLabelSize / 2 + 9) : 0;
	const hExports = data.exports ? Math.round(subLabelSize / 2 + 9) : 0;
	const hFilePathLabel = Math.round(subLabelSize / 2 + 9);

	drawRoundRect(
		context,
		x,
		y - hImports - hExports - 12,
		w,
		hFilePathLabel + hLabel + hImports + hExports + 12,
		5,
	);
	context.closePath();
	context.fill();

	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.shadowBlur = 0;

	// And finally we draw the labels
	context.fillStyle = TEXT_COLOR;
	context.font = `${weight} ${size}px ${font}`;
	context.fillText(label, data.x + data.size + 3, data.y - (4 * size) / 3 - 4);

	
	context.fillStyle = data.color;
	context.font = `${weight} ${subLabelSize}px ${font}`;
	context.fillText(filePathLabel,
		data.x + data.size + 3,
		data.y - (2 * size) / 3 - 2,
	);

	if (data.imports) {
		context.fillStyle = TEXT_COLOR;
		context.font = `${weight} ${subLabelSize}px ${font}`;
		context.fillText(importsLabel,
			data.x + data.size + 3,
			(data.y + size / 3),
		);
	}

	if (data.exports) {
		context.fillStyle = TEXT_COLOR;
		context.font = `${weight} ${subLabelSize}px ${font}`;
		context.fillText(exportsLabel,
			data.x + data.size + 3,
			data.imports ? data.y + size / 3 + 3 + subLabelSize : 
			(data.y + size / 3),
		);
	}
}

/**
 * Custom label renderer
 */
export default function drawLabel(
	context: CanvasRenderingContext2D,
	data: PartialButFor<NodeDisplayData, 'x' | 'y' | 'size' | 'label' | 'color'>,
	settings: Settings,
): void {
	if (!data.label) {
		return;
	}

	const size = settings.labelSize;
	const font = settings.labelFont;
	const weight = settings.labelWeight;

	context.font = `${weight} ${size}px ${font}`;
	const width = context.measureText(data.label).width + 8;

	context.fillStyle = '#ffffffcc';
	context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 20);

	context.fillStyle = '#000';
	context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
