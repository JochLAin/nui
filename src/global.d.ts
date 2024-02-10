declare module '!!raw-loader!sass-loader!*.scss' {
  const content: string;
  export default content;
}

declare module '!!raw-loader!*.html' {
  const content: string;
  export default content;
}

declare module '!!raw-loader!*.md' {
  const content: string;
  export default content;
}
