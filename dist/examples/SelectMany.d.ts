import { Dog, DogOwner } from "./Data";
export declare class Example_SelectMany {
    Test(): boolean;
    Example_2Dto1D(): Array<Dog>;
    /**
     * Transforms an array of owners into an array of dogs
     */
    Example_Selector(): Array<Dog>;
    /**
     * Transforms an array of owners into an array of Owner+Dog
     */
    Example_ResultSelector(): Array<{
        Owner: DogOwner;
        Dog: Dog;
    }>;
}
