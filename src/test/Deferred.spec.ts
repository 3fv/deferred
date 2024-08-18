import 'jest'
import { Deferred } from "../Deferred.js"

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
