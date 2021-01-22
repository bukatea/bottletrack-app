export type MandateProps<T extends {}, K extends keyof T> = Omit<T, K> & {
    [MK in K]-?: NonNullable<T[MK]>
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
