export default interface Interaction {
  type: number;
  data?: InteractionData;
}

interface InteractionData {
  name: string;
  // resolved?: ResolvedData;
}
