import 'jest'
import { Deferred, DeferredStatus } from "../Deferred"

test(`getError`, async () => {
	const err = Error("WTF")
	const deferred = new Deferred<any>()
	try {
		deferred.promise.catch(_err => {
		})
		deferred.reject(err)
		await deferred.promise
	} catch (_ignoredError) {
	}
	expect(err).toBe(deferred.error)
})

describe(`useCallback`, () => {
	test(`hands the deferred to the callback at once`, () => {
		let handed: Deferred<number> | null = null
		const deferred = Deferred.useCallback<number>(it => {
			handed = it
		})
		expect(handed).toBe(deferred)
		expect(deferred.status()).toBe(DeferredStatus.PENDING)
	})

	test(`resolves through a callback source`, async () => {
		const source = (done: (value: number) => void) =>
			setTimeout(() => done(42), 1)
		const deferred = Deferred.useCallback<number>(it =>
			source(value => it.resolve(value))
		)
		await expect(deferred.promise).resolves.toBe(42)
		expect(deferred.value).toBe(42)
	})

	test(`rejects when the callback throws`, async () => {
		const err = Error("sync failure")
		const deferred = Deferred.useCallback<number>(() => {
			throw err
		})
		await expect(deferred.promise).rejects.toBe(err)
		expect(deferred.error).toBe(err)
	})

	test(`rejects when an async callback rejects`, async () => {
		const err = Error("async failure")
		const deferred = Deferred.useCallback<number>(async () => {
			await Deferred.delay(1)
			throw err
		})
		await expect(deferred.promise).rejects.toBe(err)
		expect(deferred.isRejected()).toBe(true)
	})

	test(`a throw after settling leaves the deferred fulfilled`, async () => {
		const deferred = Deferred.useCallback<number>(it => {
			it.resolve(7)
			throw Error("ignored")
		})
		await expect(deferred.promise).resolves.toBe(7)
		expect(deferred.status()).toBe(DeferredStatus.FULFILLED)
	})

	test(`a rejection after settling leaves the deferred fulfilled`, async () => {
		const deferred = Deferred.useCallback<number>(async it => {
			it.resolve(7)
			await Deferred.delay(1)
			throw Error("ignored")
		})
		await expect(deferred.promise).resolves.toBe(7)
		await Deferred.delay(5)
		expect(deferred.status()).toBe(DeferredStatus.FULFILLED)
	})
})
