/* eslint-disable react/prop-types, react/no-multi-comp */
'use strict';

const xtend = require('xtend');
const React = require('react');
const createElement = React.createElement;

const { Typography } = require('@material-ui/core');

const SyntaxHighlighter = require('react-syntax-highlighter').default;
const { googlecode } = require('react-syntax-highlighter/styles/hljs');

module.exports = {
  root: 'div',
  blockquote: 'blockquote',
  break: 'br',
  delete: 'del',
  emphasis: 'em',
  image: 'img',
  imageReference: 'img',
  link: 'a',
  linkReference: 'a',
  strong: 'strong',
  table: SimpleRenderer.bind(null, 'table'),
  tableBody: SimpleRenderer.bind(null, 'tbody'),
  tableCell: TableCell,
  tableHead: SimpleRenderer.bind(null, 'thead'),
  tableRow: SimpleRenderer.bind(null, 'tr'),
  thematicBreak: 'hr',

  code: CodeBlock,
  definition: NullRenderer,
  heading: Heading,
  html: Html,
  inlineCode: InlineCode,
  list: List,
  listItem: ListItem,
  paragraph: Paragraph,
  virtualHtml: VirtualHtml,
};

function SimpleRenderer(tag, props) {
  return createElement(tag, getCoreProps(props), props.children);
}

function TableCell(props) {
  const style = props.align ? { textAlign: props.align } : undefined;
  const coreProps = getCoreProps(props);
  return createElement(
    props.isHeader ? 'th' : 'td',
    style ? xtend({ style }, coreProps) : coreProps,
    props.children
  );
}

function Heading(props) {
  let variant = '';
  switch (props.level) {
    case 1:
      variant = 'display2';
      break;
    case 2:
      variant = 'display1';
      break;
    case 3:
      variant = 'headline';
      break;
    case 4:
      variant = 'title';
      break;
    case 5:
      variant = 'subheading';
      break;
    case 6:
      variant = 'body2';
      break;
    default:
      variant = 'body1';
  }

  return createElement(
    Typography,
    { gutterBottom: true, variant: variant },
    props.children
  );
}

function List(props) {
  const attrs = getCoreProps(props);
  if (props.start !== null && props.start !== 1) {
    attrs.start = props.start.toString();
  }

  return createElement(props.ordered ? 'ol' : 'ul', attrs, props.children);
}

function ListItem(props) {
  let checkbox = null;
  if (props.checked !== null) {
    const checked = props.checked;
    checkbox = createElement('input', {
      type: 'checkbox',
      checked,
      readOnly: true,
    });
  }

  return createElement('li', getCoreProps(props), checkbox, props.children);
}

function Paragraph(props) {
  return createElement(Typography, { gutterBottom: true }, props.children);
}

function CodeBlock(props) {
  const language = props.language ? props.language : '';
  const code = createElement(
    SyntaxHighlighter,
    { language: language, style: googlecode },
    props.value
  );
  return createElement('pre', getCoreProps(props), code);
}

function InlineCode(props) {
  return createElement('code', getCoreProps(props), props.value);
}

function Html(props) {
  if (props.skipHtml) {
    return null;
  }

  const tag = props.isBlock ? 'div' : 'span';
  if (props.escapeHtml) {
    // @todo when fiber lands, we can simply render props.value
    return createElement(tag, null, props.value);
  }

  const nodeProps = { dangerouslySetInnerHTML: { __html: props.value } };
  return createElement(tag, nodeProps);
}

function VirtualHtml(props) {
  return createElement(props.tag, getCoreProps(props), props.children);
}

function NullRenderer() {
  return null;
}

function getCoreProps(props) {
  return props['data-sourcepos']
    ? { 'data-sourcepos': props['data-sourcepos'] }
    : {};
}
