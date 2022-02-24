import { BypassHTMLsanitizationPipe } from './bypass-htmlsanitization.pipe';

describe('BypassHTMLsanitizationPipe', () => {
  it('create an instance', () => {
    const pipe = new BypassHTMLsanitizationPipe();
    expect(pipe).toBeTruthy();
  });
});
