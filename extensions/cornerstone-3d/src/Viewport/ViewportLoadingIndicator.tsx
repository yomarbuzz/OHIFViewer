import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Enums } from '@cornerstonejs/core';

function ViewportLoadingIndicator({ viewportData, element }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const loadIndicatorRef = useRef(null);
  const imageIdToBeLoaded = useRef(null);

  useEffect(() => {
    if (!element) {
      return;
    }

    const setLoadingState = evt => {
      clearTimeout(loadIndicatorRef.current);
      imageIdToBeLoaded.current = evt.detail.imageId;

      loadIndicatorRef.current = setTimeout(() => {
        if (imageIdToBeLoaded.current === evt.detail.imageId) {
          setLoading(true);
        }
      }, 50);
    };

    const setFinishLoadingState = evt => {
      clearTimeout(loadIndicatorRef.current);

      setLoading(false);
      imageIdToBeLoaded.current = null;
    };

    const setErrorState = evt => {
      clearTimeout(loadIndicatorRef.current);

      if (imageIdToBeLoaded.current === evt.detail.imageId) {
        setError(evt.detail.error);
        imageIdToBeLoaded.current = null;
      }
    };

    element.addEventListener(Enums.Events.PRE_STACK_NEW_IMAGE, setLoadingState);
    element.addEventListener(Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    element.addEventListener(
      Enums.Events.STACK_NEW_IMAGE,
      setFinishLoadingState
    );

    return () => {
      element.removeEventListener(
        Enums.Events.PRE_STACK_NEW_IMAGE,
        setLoadingState
      );

      element.removeEventListener(
        Enums.Events.STACK_NEW_IMAGE,
        setFinishLoadingState
      );

      element.removeEventListener(Enums.Events.IMAGE_LOAD_ERROR, setErrorState);
    };
  }, [element, viewportData]);

  if (error) {
    return (
      <>
        <div className="bg-black opacity-50 absolute h-full w-full top-0 left-0">
          <div className="flex transparent items-center justify-center w-full h-full">
            <p className="text-primary-light text-xl font-light">
              <h4>Error Loading Image</h4>
              <p>An error has occurred.</p>
              <p>{error}</p>
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="bg-black opacity-50 absolute h-full w-full top-0 left-0">
          <div className="flex transparent items-center justify-center w-full h-full">
            <p className="text-primary-light text-xl font-light">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return null;
}

ViewportLoadingIndicator.propTypes = {
  percentComplete: PropTypes.number,
  error: PropTypes.object,
};

ViewportLoadingIndicator.defaultProps = {
  percentComplete: 0,
  error: null,
};

export default ViewportLoadingIndicator;
