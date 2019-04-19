import React from 'react';
import {getIn} from 'formik';

const types = {
	TEXT: 'text',
	RICH_TEXT: 'richtext',
};

const renderTextNode = (node, WrappingTag = 'div', context = {}) => {
	if (typeof node === 'string') {
		return node;
	}

	let content;

	if (node && node.content) {
		content = node.content;
	}

	if (node && node.contentPath) {
		content = getIn(context, node.contentPath);
	}

	if (node && node.type === types.TEXT) {
		return content;
	}

	if (node && node.type === types.RICH_TEXT) {
		return <WrappingTag dangerouslySetInnerHTML={{ __html: content }} />;
	}

	return undefined;
};

export default renderTextNode;
