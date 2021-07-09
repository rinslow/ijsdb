import * as esprima from 'esprima';

/**
 * Extract parameter names from function
 * code taken from https://stackoverflow.com/a/22043134/5693014
 */
export function getFunctionParameters(func): string[] {

  let i;
  // safetyValve is necessary, because sole "function () {...}"
  // is not a valid syntax
  const parsed = esprima.parse('safetyValve = ' + func.toString());
  const params = parsed.body[0].expression.right.params;
  const ret = [];

  for (i = 0; i < params.length; i += 1) {
    // Handle default params. Exe: function defaults(a = 0,b = 2,c = 3){}
    if (params[i].type == 'AssignmentPattern') {
      ret.push(params[i].left.name);
    } else {
      ret.push(params[i].name);
    }
  }

  return ret;
}

/**
 * evals with context
 * code taken from https://stackoverflow.com/a/25859853/5693014
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function evalInScope(js: string, contextAsScope: object) {
  //# Return the results of the in-line anonymous function we .call with the passed context
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return function() { // @ts-ignore
    // eslint-disable-next-line no-with
    with(this) { return eval(js); }; }.call(contextAsScope);
}
