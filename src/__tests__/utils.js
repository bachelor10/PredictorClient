import * as utils from '../utils'

describe('Utils', () => {
    describe('Remove overlapping', () => {
        it('Splits overlapping coordinates into two lists', () => {

            const buffer = [
                [
                    {x: 0, y: 0},
                    {x: 5, y: 5},
                    {x: -5, y: -5},
                    {x: 10, y: 10}
                ]
            ]
            const newBuffer = utils.removeOverlapping(buffer, {x: -2.5, y: -2.5}, 5)
    
    
            expect(newBuffer).toEqual([
                [{x: 5, y: 5}],
                [{x: 10, y: 10}]
            ])
        })
    
        it('Removes list when all coordinates are deleted', () => {
            const buffer = [
                [
                    {x: 0, y: 0},
                ]
            ]
    
            const newBuffer = utils.removeOverlapping(buffer, {x: 0, y: 0})
    
            expect(newBuffer).toEqual([])
        })    
    })

    describe('Accumulate distance', () => {
        it('Acumulates distance', () => {
            const trace = [{x: 0, y: 0}, {x: 3, y: 0}, {x: 5, y: 0}, {x: 10, y: 0}]
    
            const totalDistance = utils.accumulateDistance(trace);
    
            expect(totalDistance).toEqual(10)
        })
    })
    
    describe('Get overlapping', () => {
        it('Finds the trace with closest overlapping', () => {
            const buffer = [
                [{x: 0, y: 0}, {x: 3, y: 0}, {x: 5, y: 0}, {x: 10, y: 0}],
                [{x: -1, y: -1}, {x: 3, y: 0}, {x: 5, y: 0}, {x: 10, y: 0}],
            ]
    
            const overlappingTrace = utils.getOverlapping(buffer, {x: -1, y: -1}, 2);
    
            expect(overlappingTrace).toEqual(1)
        })
    })

})

