import { Fragment } from 'react';

function Words({ text, muted }: { text: string; muted?: boolean }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className={muted ? 'w m' : 'w'}>{word}</span>{' '}
        </Fragment>
      ))}
    </>
  );
}

/** Section heading. Each word is its own span so it can sharpen on scroll. */
export function Title({ lead, muted }: { lead: string; muted?: string }) {
  return (
    <h2 className="title">
      <Words text={lead} />
      {muted && <Words text={muted} muted />}
    </h2>
  );
}
