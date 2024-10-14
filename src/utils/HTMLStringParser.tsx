import parse, {
  Element,
  HTMLReactParserOptions,
  domToReact,
  DOMNode,
} from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (!(domNode instanceof Element)) {
      return;
    }

    const { attribs, children, name } = domNode;

    if (attribs.id === 'main') {
      return (
        <h1 style={{ fontSize: 42 }}>
          {domToReact(children as DOMNode[], options)}
        </h1>
      );
    }

    if (name === 'pre') {
      return (
        <div className='w-full'>
          {domToReact(children as DOMNode[], options)}
        </div>
      );
    }

    if (attribs.href) {
      const href = attribs.href;
      if (href.startsWith('https://preview.redd.it')) {
        return (
          <a href={href} target='_blank'>
            <img
              src={href}
              alt='Comment Image Placeholder'
              className='w-auto h-auto max-w-[75%] max-h-80'
            />
          </a>
        );
      }

      return (
        <a
          href={href}
          target='_blank'
          className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'
        >
          {domToReact(children as DOMNode[], options)}
        </a>
      );
    }
  },
};

const parseHTMLtoComponent = (html: string) => {
  return parse(DOMPurify.sanitize(html), options)
}

export default parseHTMLtoComponent
