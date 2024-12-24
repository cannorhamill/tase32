import { SpringConfig } from "@react-spring/web";

export const SPRING_CONFIG: SpringConfig = {
  mass: 1,
  tension: 20,
  friction: 10,
};

export const numberAnimation = (targetNumber: number) => ({
  from: { number: 0 },
  to: { number: targetNumber },
  delay: 200,
  config: SPRING_CONFIG,
});