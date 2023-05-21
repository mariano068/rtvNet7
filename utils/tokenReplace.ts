export const tokenReplace = (template: string, tokens: Record<string, string>) => {
    let result = template;
    Object.keys(tokens).forEach(token => {
        result = result.replace(new RegExp(`{{${token}}}`, 'g'), tokens[token]);
    });
    return result;
}
