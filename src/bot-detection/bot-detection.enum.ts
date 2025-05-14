export enum HttpHeaderKey {
  Accept = 'accept',
  AcceptLanguage = 'accept-language',
  AcceptEncoding = 'accept-encoding',
  UserAgent = 'user-agent',
  Host = 'host',
  XForwardedFor = 'x-forwarded-for',
  Authority = ':authority',
}

export enum Verdict {
  Bot = 'bot',
  Human = 'human',
}
