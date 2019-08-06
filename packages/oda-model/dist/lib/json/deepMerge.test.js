"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const deepMerge_1 = require("./deepMerge");
describe('find', () => {
    it('number', () => {
        const src = [0, 1, 2, 3, 4, 5, 6];
        expect(deepMerge_1.find(src, 1)).toBe(1);
    });
    it('string', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        expect(deepMerge_1.find(src, '1')).toBe(1);
    });
    it('objects as ref', () => {
        const value = { '0': '0' };
        const src = [value, '1', '2', '3', '4', '5', '6'];
        expect(deepMerge_1.find(src, value)).toBe(0);
    });
    it('objects as structure equals', () => {
        const src = [{ '0': '0' }, '1', '2', '3', '4', '5', '6'];
        expect(deepMerge_1.find(src, { '0': '0' })).toBe(0);
    });
});
describe('arrayItemOperation', () => {
    it('leave intact if there is no remove', () => {
        expect(deepMerge_1.arrayItemOperation({ '7': '7' })).toMatchObject({ '7': '7' });
        expect(deepMerge_1.arrayItemOperation('7')).toBe('7');
        expect(deepMerge_1.arrayItemOperation(['7', '5', 'undefined', '3'])).toMatchObject([
            '7',
            '5',
            'undefined',
            '3',
        ]);
        const val = ['7', '5', 'undefined', '3'];
        expect(deepMerge_1.arrayItemOperation(val) === val).toBeTruthy();
        expect(deepMerge_1.arrayItemOperation(val)).toMatchObject(['7', '5', 'undefined', '3']);
    });
    it('remove one object', () => {
        expect(deepMerge_1.arrayItemOperation('^7')).toMatchObject({ $unset: '7' });
        expect(deepMerge_1.arrayItemOperation('^[7,5,3]')).toMatchObject({
            $unset: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('^[7,  5  ,,3]')).toMatchObject({
            $unset: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('^[7,5,null,3]')).toMatchObject({
            $unset: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('^[7,5,undefined,3]')).toMatchObject({
            $unset: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('[7,^5,undefined,3]')).toMatchObject([
            '7',
            { $unset: '5' },
            '3',
        ]);
        expect(deepMerge_1.arrayItemOperation(['7', '^5', 'undefined', '3'])).toMatchObject([
            '7',
            { $unset: '5' },
            'undefined',
            '3',
        ]);
        const val = ['7', '5', '^undefined', '3'];
        expect(deepMerge_1.arrayItemOperation(val) !== val).toBeTruthy();
        expect(deepMerge_1.arrayItemOperation(val)).toMatchObject([
            '7',
            '5',
            { $unset: 'undefined' },
            '3',
        ]);
    });
    it('assigns', () => {
        expect(deepMerge_1.arrayItemOperation('=7')).toMatchObject({ $assign: '7' });
        expect(deepMerge_1.arrayItemOperation('=[7,5,3]')).toMatchObject({
            $assign: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('=[7,  5  ,,3]')).toMatchObject({
            $assign: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('=[7,5,null,3]')).toMatchObject({
            $assign: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('=[7,5,undefined,3]')).toMatchObject({
            $assign: ['7', '5', '3'],
        });
        expect(deepMerge_1.arrayItemOperation('[7,=5,undefined,3]')).toMatchObject([
            '7',
            { $assign: '5' },
            '3',
        ]);
        expect(deepMerge_1.arrayItemOperation(['7', '=5', 'undefined', '3'])).toMatchObject([
            '7',
            { $assign: '5' },
            'undefined',
            '3',
        ]);
        const val = ['7', '5', '=undefined', '3'];
        expect(deepMerge_1.arrayItemOperation(val) !== val).toBeTruthy();
        expect(deepMerge_1.arrayItemOperation(val)).toMatchObject([
            '7',
            '5',
            { $assign: 'undefined' },
            '3',
        ]);
    });
});
describe('processArray', () => {
    it('number', () => {
        const src = [0, 1, 2, 3, 4, 5, 6];
        deepMerge_1.processArray(src, 7);
        expect(deepMerge_1.find(src, 7)).toBe(7);
    });
    it('string', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, '7');
        expect(deepMerge_1.find(src, '7')).toBe(7);
    });
    it('objects as ref', () => {
        const value = { '7': '7' };
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, value);
        expect(deepMerge_1.find(src, value)).toBe(7);
    });
    it('objects as structure equals', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, { '7': '7' });
        expect(deepMerge_1.find(src, { '7': '7' })).toBe(7);
    });
    it('remove string', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, '^1');
        expect(deepMerge_1.find(src, '1')).toBe(-1);
    });
    it('remove string list', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, '^[1, 2, 5]');
        expect(deepMerge_1.find(src, '1')).toBe(-1);
        expect(deepMerge_1.find(src, '2')).toBe(-1);
        expect(deepMerge_1.find(src, '5')).toBe(-1);
    });
    it('assign string', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, '=1');
        expect(deepMerge_1.find(src, '1')).toBe(0);
        expect(src.length).toBe(1);
    });
    it('assign string list', () => {
        const src = ['0', '1', '2', '3', '4', '5', '6'];
        deepMerge_1.processArray(src, '=[100, 200]');
        expect(deepMerge_1.find(src, '100')).toBe(0);
        expect(deepMerge_1.find(src, '200')).toBe(1);
        expect(src.length).toBe(2);
    });
});
//# sourceMappingURL=deepMerge.test.js.map