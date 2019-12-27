import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'

const STEP_STATUS = {
  CURRENT: 'current',
  FINISHED: 'finished',
  UNFINISHED: 'unfinished'
}

export default function StepProgress(props) {
  
    const defaultStyles = {
      stepProgressSize: 30,
      currentStepProgressSize: 40,
      separatorStrokeWidth: 3,
      separatorStrokeUnfinishedWidth: 0,
      separatorStrokeFinishedWidth: 0,
      currentStepStrokeWidth: 5,
      stepStrokeWidth: 0,
      stepStrokeCurrentColor: '#4aae4f',
      stepStrokeFinishedColor: '#4aae4f',
      stepStrokeUnFinishedColor: '#4aae4f',
      separatorFinishedColor: '#4aae4f',
      separatorUnFinishedColor: '#a4d4a5',
      stepProgressFinishedColor: '#4aae4f',
      stepProgressUnFinishedColor: '#a4d4a5',
      stepProgressCurrentColor: '#ffffff',
      stepProgressLabelFontSize: 15,
      currentStepProgressLabelFontSize: 15,
      stepProgressLabelCurrentColor: '#000000',
      stepProgressLabelFinishedColor: '#ffffff',
      stepProgressLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
      labelColor: '#000000',
      labelSize: 13,
      labelAlign: 'center',
      currentStepLabelColor: '#4aae4f'
    }    

    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const [progressBarSize, setProgressBarSize] = useState(0)
    const [customStyles, setCustomStyles] = useState(Object.assign(defaultStyles, props.customStyles))

    const progressAnim = new Animated.Value(0)
    const sizeAnim = new Animated.Value(
      customStyles.stepProgressSize
    )
    const borderRadiusAnim = new Animated.Value(
      customStyles.stepProgressSize / 2
    )

  function stepPressed (position) {
    if (props.onPress) {
      props.onPress(position)
    }
  }

  const { labels, direction } = props
  
  useEffect( () => {
    setCustomStyles(Object.assign(customStyles, props.customStyles));
    onCurrentPositionChanged(props.currentPosition);
  });  

  renderProgressBarBackground = () => {
    const { stepCount, direction } = props
    let progressBarBackgroundStyle
    if (direction === 'vertical') {
      progressBarBackgroundStyle = {
        backgroundColor: customStyles.separatorUnFinishedColor,
        position: 'absolute',
        left:
          (width - customStyles.separatorStrokeWidth) / 2,
        top: height / (2 * stepCount),
        bottom: height / (2 * stepCount),
        width:
          customStyles.separatorStrokeUnfinishedWidth == 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeUnfinishedWidth
      }
    } else {
      progressBarBackgroundStyle = {
        backgroundColor: customStyles.separatorUnFinishedColor,
        position: 'absolute',
        top:
          (height - customStyles.separatorStrokeWidth) /
          2,
        left: width / (2 * stepCount),
        right: width / (2 * stepCount),
        height:
          customStyles.separatorStrokeUnfinishedWidth == 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeUnfinishedWidth
      }
    }
    return (
      <View
        onLayout={event => {
          if (direction === 'vertical') {
            setProgressBarSize(event.nativeEvent.layout.height)
          } else {
            setProgressBarSize(event.nativeEvent.layout.width)
          }
        }}
        style={progressBarBackgroundStyle}
      />
    )
  }

  renderProgressBar = () => {
    const { stepCount, direction } = props
    let progressBarStyle
    if (direction === 'vertical') {
      progressBarStyle = {
        backgroundColor: customStyles.separatorFinishedColor,
        position: 'absolute',
        left:
          (width - customStyles.separatorStrokeWidth) / 2,
        top: height / (2 * stepCount),
        bottom: height / (2 * stepCount),
        width:
          customStyles.separatorStrokeFinishedWidth == 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeFinishedWidth,
        height: progressAnim
      }
    } else {
      progressBarStyle = {
        backgroundColor: customStyles.separatorFinishedColor,
        position: 'absolute',
        top:
          (height - customStyles.separatorStrokeWidth) /
          2,
        left: width / (2 * stepCount),
        right: width / (2 * stepCount),
        height:
          customStyles.separatorStrokeFinishedWidth == 0
            ? customStyles.separatorStrokeWidth
            : customStyles.separatorStrokeFinishedWidth,
        width: progressAnim
      }
    }
    return <Animated.View style={progressBarStyle} />
  }

  renderStepProgress = () => {
    let steps = []
    const { labels, stepCount, direction } = props
    for (let position = 0; position < stepCount; position++) {
      steps.push(
        <TouchableWithoutFeedback
          key={position}
          onPress={() => stepPressed(position)}
        >
          <View
            style={[
              styles.stepContainer,
              direction === 'vertical'
                ? { flexDirection: 'column' }
                : { flexDirection: 'row' }
            ]}
          >
            {renderStep(position)}
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return (
      <View
        onLayout={event => {
            setWidth(event.nativeEvent.layout.width)
            setHeight(event.nativeEvent.layout.height)
          }
        }
        style={[
          styles.stepProgressContainer,
          direction === 'vertical'
            ? {
              flexDirection: 'column',
              width: customStyles.currentStepProgressSize
            }
            : {
              flexDirection: 'row',
              height: customStyles.currentStepProgressSize
            }
        ]}
      >
        {steps}
      </View>
    )
  }

  renderStepLabels = () => {
    const { labels, direction, currentPosition, renderLabel } = props
    var labelViews = labels.map((label, index) => {
      const selectedStepLabelStyle =
        index === currentPosition
          ? { color: customStyles.currentStepLabelColor }
          : { color: customStyles.labelColor }
      return (
        <TouchableWithoutFeedback
          style={styles.stepLabelItem}
          key={index}
          onPress={() => stepPressed(index)}
        >
          <View style={styles.stepLabelItem}>
            {renderLabel ? (
              renderLabel({
                position: index,
                stepStatus: getStepStatus(index),
                label,
                currentPosition
              })
            ) : (
              <Text
                style={[
                  styles.stepLabel,
                  selectedStepLabelStyle,
                  {
                    fontSize: customStyles.labelSize,
                    fontFamily: customStyles.labelFontFamily
                  }
                ]}
              >
                {label}
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      )
    })

    return (
      <View
        style={[
          styles.stepLabelsContainer,
          direction === 'vertical'
            ? { flexDirection: 'column', paddingHorizontal: 4 }
            : { flexDirection: 'row', paddingVertical: 4 },
          { alignItems: customStyles.labelAlign }
        ]}
      >
        {labelViews}
      </View>
    )
  }

  renderStep = position => {
    const {
      currentPosition,
      stepCount,
      direction,
      renderStepProgress
    } = props
    let stepStyle
    let indicatorLabelStyle
    const separatorStyle =
      direction === 'vertical'
        ? { width: customStyles.separatorStrokeWidth, zIndex: 10 }
        : { height: customStyles.separatorStrokeWidth }
    switch (getStepStatus(position)) {
      case STEP_STATUS.CURRENT: {
        stepStyle = {
          backgroundColor: customStyles.stepProgressCurrentColor,
          borderWidth: customStyles.currentStepStrokeWidth,
          borderColor: customStyles.stepStrokeCurrentColor,
          height: sizeAnim,
          width: sizeAnim,
          borderRadius: borderRadiusAnim
        }
        indicatorLabelStyle = {
          fontSize: customStyles.currentStepProgressLabelFontSize,
          color: customStyles.stepProgressLabelCurrentColor
        }

        break
      }
      case STEP_STATUS.FINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepProgressFinishedColor,
          borderWidth: customStyles.stepStrokeWidth,
          borderColor: customStyles.stepStrokeFinishedColor,
          height: customStyles.stepProgressSize,
          width: customStyles.stepProgressSize,
          borderRadius: customStyles.stepProgressSize / 2
        }
        indicatorLabelStyle = {
          fontSize: customStyles.stepProgressLabelFontSize,
          color: customStyles.stepProgressLabelFinishedColor
        }
        break
      }

      case STEP_STATUS.UNFINISHED: {
        stepStyle = {
          backgroundColor: customStyles.stepProgressUnFinishedColor,
          borderWidth: customStyles.stepStrokeWidth,
          borderColor: customStyles.stepStrokeUnFinishedColor,
          height: customStyles.stepProgressSize,
          width: customStyles.stepProgressSize,
          borderRadius: customStyles.stepProgressSize / 2
        }
        indicatorLabelStyle = {
          overflow: 'hidden',
          fontSize: customStyles.stepProgressLabelFontSize,
          color: customStyles.stepProgressLabelUnFinishedColor
        }
        break
      }
      default:
    }

    return (
      <Animated.View key={'step-indicator'} style={[styles.step, stepStyle]}>
        {renderStepProgress ? (
          renderStepProgress({
            position,
            stepStatus: getStepStatus(position)
          })
        ) : (
          <Text style={indicatorLabelStyle}>{`${position + 1}`}</Text>
        )}
      </Animated.View>
    )
  }

  getStepStatus = stepPosition => {
    const { currentPosition } = props
    if (stepPosition === currentPosition) {
      return STEP_STATUS.CURRENT
    } else if (stepPosition < currentPosition) {
      return STEP_STATUS.FINISHED
    } else {
      return STEP_STATUS.UNFINISHED
    }
  }

  onCurrentPositionChanged = position => {
    let { stepCount } = props
    if (position > stepCount - 1) {
      position = stepCount - 1
    }
    const animateToPosition =
      (progressBarSize / (stepCount - 1)) * position
    sizeAnim.setValue(customStyles.stepProgressSize)
    borderRadiusAnim.setValue(
      customStyles.stepProgressSize / 2
    )
    Animated.sequence([
      Animated.timing(progressAnim, {
        toValue: animateToPosition,
        duration: 200
      }),
      Animated.parallel([
        Animated.timing(sizeAnim, {
          toValue: customStyles.currentStepProgressSize,
          duration: 100
        }),
        Animated.timing(borderRadiusAnim, {
          toValue: customStyles.currentStepProgressSize / 2,
          duration: 100
        })
      ])
    ]).start()
  }

  return (
    <View
      style={[
        styles.container,
        direction === 'vertical'
          ? { flexDirection: 'row', flex: 1 }
          : { flexDirection: 'column' }
      ]}
    >
      {width !== 0 && renderProgressBarBackground()}
      {width !== 0 && renderProgressBar()}
      {renderStepProgress()}
      {labels && renderStepLabels()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  stepProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent'
  },
  stepLabelsContainer: {
    justifyContent: 'space-around'
  },
  step: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500'
  },
  stepLabelItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

StepProgress.propTypes = {
  currentPosition: PropTypes.number,
  stepCount: PropTypes.number,
  customStyles: PropTypes.object,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  labels: PropTypes.array,
  onPress: PropTypes.func,
  renderStepProgress: PropTypes.func,
  renderLabel: PropTypes.func
}

StepProgress.defaultProps = {
  currentPosition: 0,
  stepCount: 5,
  customStyles: {},
  direction: 'horizontal'
}
