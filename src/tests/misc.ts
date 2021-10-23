export function randomString(size = 7): string {
  return (Math.random() + 1).toString(36).substring(size);
}

export function randomNumber(min: number, max: number, scale: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(scale));
}

export function randomInteger(min = 0, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
