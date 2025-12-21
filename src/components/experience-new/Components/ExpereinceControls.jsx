import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { degToRad } from 'three/src/math/MathUtils'
import * as THREE from 'three'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'

// Configurable lerp speed constants for camera animations
// These are multiplied by delta time (~0.016 at 60fps), so:
// - 1.0 = ~1 second animation
// - 2.0 = ~0.5 second animation
// - 0.5 = ~2 second animation
const HIDE_LEVEL_LERP_SPEED = 1.5    // Speed for hide level camera animation
const SNAP_POINT_LERP_SPEED = 2.0    // Speed for snap point camera animation
const RESET_CAMERA_LERP_SPEED = 1.5  // Speed for camera reset animation

export default function ExpereinceControls({ data }) {
  const { experienceState, experienceDispatch } = useExperienceContext()
  const { scene, camera } = useThree()
  const refControls = useRef(null)
  const lerpValue = .01

  // Store the default camera state when the scene first loads
  const defaultCamPosRef = useRef(null)
  const defaultCamQuatRef = useRef(null)
  const defaultTargetRef = useRef(new THREE.Vector3())

  // Track list of snap point objects currently hidden
  const hiddenSnapRef = useRef([])

  // Lerp animation state
  const lerpRef = useRef({
    active: false,
    startPos: new THREE.Vector3(),      // Starting camera position
    startLookAt: new THREE.Vector3(),   // Starting lookAt/target position
    targetPos: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    progress: 0,
    speed: SNAP_POINT_LERP_SPEED // Default speed, will be set per animation type
  })

  // Track if component has mounted to prevent animations on initial render
  const hasMountedRef = useRef(false)

  // Helper function to start a lerp animation
  // Captures starting position, disables controls, and sets up the animation
  const startLerpAnimation = (targetPos, targetLookAt, speed) => {
    const controls = refControls.current
    if (!controls) return
    const cam = controls.object
    if (!cam) return

    // Capture current positions as starting point
    lerpRef.current.startPos.copy(cam.position)
    lerpRef.current.startLookAt.copy(controls.target)

    // Set target positions
    lerpRef.current.targetPos.copy(targetPos)
    lerpRef.current.targetLookAt.copy(targetLookAt)

    // Set speed and reset progress
    lerpRef.current.speed = speed
    lerpRef.current.progress = 0

    // Disable controls during animation to prevent fighting
    controls.enabled = false

    // Activate lerp
    lerpRef.current.active = true
  }

  // Note: Legacy snap point handling removed - it was conflicting with the lerp animation
  // by directly setting camera quaternion and target, which interferes with OrbitControls.
  // All snap point handling is now done in the lerp-based useEffect below.

  // Capture initial camera + target once controls are ready and mark as mounted
  useEffect(() => {
    const controls = refControls.current
    if (!controls) return
    const cam = controls.object
    if (cam && !defaultCamPosRef.current) {
      defaultCamPosRef.current = cam.position.clone()
      defaultCamQuatRef.current = cam.quaternion.clone()
      defaultTargetRef.current = controls.target?.clone ? controls.target.clone() : new THREE.Vector3()
    }
    // Mark as mounted after a short delay to allow initial render to complete
    const timeout = setTimeout(() => {
      hasMountedRef.current = true
    }, 100)
    return () => clearTimeout(timeout)
  }, [])

  // Handle snapping and reset behavior with lerp animation
  useEffect(() => {
    // Skip on initial mount - only respond to actual user-triggered snap point changes
    if (!hasMountedRef.current) return

    const controls = refControls.current
    if (!controls) return
    const cam = controls.object

    if (experienceState?.snapPoint === 'reset') {
      // Make all snap points visible again
      try {
        if (Array.isArray(hiddenSnapRef.current)) {
          hiddenSnapRef.current.forEach((obj) => { if (obj) obj.visible = true })
          hiddenSnapRef.current = []
        }
        const snaps = Array.isArray(data?.roomSnaps) ? data.roomSnaps : []
        const names = snaps.map((s) => s?.name).filter(Boolean)
        scene.traverse((obj) => {
          if (names.includes(obj?.name)) obj.visible = true
        })
      } catch (e) { }

      // Start lerp to initial camera position (reset uses its own speed)
      if (defaultCamPosRef.current && defaultTargetRef.current) {
        startLerpAnimation(defaultCamPosRef.current, defaultTargetRef.current, RESET_CAMERA_LERP_SPEED)
      }
      experienceDispatch({ type: ACTIONS_EXPERIENCE.MODEL_VIEW })
      return
    }

    if (!experienceState?.snapPoint) return

    const snapRoot = scene.getObjectByName(experienceState.snapPoint)
    if (!snapRoot) return

    let worldPos = null
    let worldQuat = null
    snapRoot.traverse((i) => {
      if (i?.isMesh && !worldPos && !worldQuat) {
        worldPos = i.getWorldPosition(new THREE.Vector3())
        worldQuat = i.getWorldQuaternion(new THREE.Quaternion())
      }
    })

    if (!worldPos || !worldQuat) {
      worldPos = snapRoot.getWorldPosition(new THREE.Vector3())
      worldQuat = snapRoot.getWorldQuaternion(new THREE.Quaternion())
    }

    // Compute the forward (-Z) direction in world space from the snap's orientation
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuat).normalize()

    // Preserve current orbit radius relative to target
    const currentTarget = controls.target?.clone ? controls.target.clone() : new THREE.Vector3()
    const distance = cam.position.clone().sub(currentTarget).length() || 1

    // Calculate target camera position (behind snap point along +Z)
    const targetCamPos = worldPos.clone().sub(forward.clone().multiplyScalar(distance))

    // Start lerp animation to snap point with snap point speed
    startLerpAnimation(targetCamPos, worldPos, SNAP_POINT_LERP_SPEED)

    // Manage snap point visibility: hide current name across entire scene
    if (Array.isArray(hiddenSnapRef.current) && hiddenSnapRef.current.length) {
      hiddenSnapRef.current.forEach((obj) => { if (obj) obj.visible = true })
      hiddenSnapRef.current = []
    }

    const toHide = []
    scene.traverse((obj) => {
      if (obj?.name === experienceState.snapPoint) toHide.push(obj)
    })
    if (!toHide.length && snapRoot) toHide.push(snapRoot)

    toHide.forEach((rootObj) => {
      rootObj.traverse((node) => {
        node.visible = false
        hiddenSnapRef.current.push(node)
      })
    })
  }, [experienceState?.snapPoint, scene])

  useEffect(() => {
    if (experienceState?._360Mode) {
      refControls.current.target = new THREE.Vector3(0, 0, -1)
    }
  }, [experienceState?._360Mode])

  // Handle camera reset action - reset to initial camera position/rotation INSTANTLY
  useEffect(() => {
    // Skip if not mounted or resetCamera is falsy
    if (!hasMountedRef.current || !experienceState?.resetCamera) return

    // Make all snap points visible again
    try {
      if (Array.isArray(hiddenSnapRef.current) && hiddenSnapRef.current.length) {
        hiddenSnapRef.current.forEach((obj) => { if (obj) obj.visible = true })
        hiddenSnapRef.current = []
      }
      const snaps = Array.isArray(data?.roomSnaps) ? data.roomSnaps : []
      const names = snaps.map((s) => s?.name).filter(Boolean)
      scene.traverse((obj) => {
        if (names.includes(obj?.name)) obj.visible = true
      })
    } catch (e) { }

    // Instant reset - no lerp
    if (defaultCamPosRef.current && defaultTargetRef.current) {
      // 1. Cancel any active lerp
      lerpRef.current.active = false
      lerpRef.current.progress = 0

      const controls = refControls.current
      if (controls) {
        const cam = controls.object

        // 2. Snap to default positions
        if (cam) cam.position.copy(defaultCamPosRef.current)
        controls.target.copy(defaultTargetRef.current)

        // 3. Make sure camera looks at the target
        cam.lookAt(controls.target)

        // 4. Update and enable controls
        controls.enabled = true
        controls.update()
      }
    }
  }, [experienceState?.resetCamera])

  // Handle camera movement on hide level click
  useEffect(() => {
    // Skip if not mounted or lerpToHideLevel is falsy
    if (!hasMountedRef.current || !experienceState?.lerpToHideLevel) return

    const minDist = data?.minDistance || 5
    // Target position: [-minDistance, minDistance, minDistance]
    const targetPos = new THREE.Vector3(-minDist, minDist, minDist)
    const targetLookAt = new THREE.Vector3(0, 0, 0)

    // Start lerp animation to hide level position with hide level speed
    startLerpAnimation(targetPos, targetLookAt, HIDE_LEVEL_LERP_SPEED)
  }, [experienceState?.lerpToHideLevel])

  // useFrame for smooth lerp animation
  // Controls are disabled during animation and re-enabled when complete
  useFrame((_, delta) => {
    if (!lerpRef.current.active) return
    const controls = refControls.current
    if (!controls) return
    const cam = controls.object
    if (!cam) return

    // Increment progress
    lerpRef.current.progress += delta * lerpRef.current.speed
    const t = Math.min(lerpRef.current.progress, 1)

    // Smooth easing function (ease-out cubic)
    const easeT = 1 - Math.pow(1 - t, 3)

    // Interpolate from start to target positions using lerpVectors
    cam.position.lerpVectors(lerpRef.current.startPos, lerpRef.current.targetPos, easeT)
    controls.target.lerpVectors(lerpRef.current.startLookAt, lerpRef.current.targetLookAt, easeT)

    // Make camera look at the interpolated target position
    cam.lookAt(controls.target)
    controls.update()

    // Stop when complete and re-enable controls
    if (t >= 1) {
      // Set final positions exactly
      cam.position.copy(lerpRef.current.targetPos)
      controls.target.copy(lerpRef.current.targetLookAt)
      cam.lookAt(controls.target)

      // Re-enable controls for user input
      controls.enabled = true
      controls.update()

      // Reset lerp state
      lerpRef.current.active = false
      lerpRef.current.progress = 0
    }
  })

  return (
    <OrbitControls
      ref={refControls}
      enablePan={false}
      minDistance={experienceState?.firstPersonView ? 0 : data?.minDistance}
      maxDistance={experienceState?.firstPersonView ? 0.15 : data?.maxDistance}
      // autoRotateSpeed={.1}
      maxPolarAngle={experienceState?.firstPersonView ? degToRad(120) : degToRad(85)}
      minPolarAngle={experienceState?.firstPersonView ? degToRad(60) : degToRad(0)}
    // minAzimuthAngle={degToRad(-45)}
    // maxAzimuthAngle={degToRad(90)}
    />
  )
}
