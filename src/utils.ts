export function assertType(toCheck, type: Function) {
  if (!(toCheck instanceof type)) {
    throw new TypeError(typeof(toCheck) + " not of type: " + type.name) 
  }
}