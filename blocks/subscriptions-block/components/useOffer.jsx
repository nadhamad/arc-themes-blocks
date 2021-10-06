import {useCallback, useEffect, useState} from 'react';
import {useFusionContext} from 'fusion:context';
import getProperties from 'fusion:properties';
import {isServerSide} from '@wpmedia/engine-theme-sdk';

const offerService = ({
  origin,
  code,
  endpoint,
}) => fetch(`${origin}${endpoint}${code || 'default'}`, {})
  .then((res) => res.json());

const useOffer = ({ campaignCode }) => {
  const { arcSite } = useFusionContext();
  const { api: { retail: { origin = null, endpoint } } } = getProperties(arcSite);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  const fetchOffer = useCallback(async (code) => {
    try {
      return await offerService({
        code,
        origin,
        endpoint,
      });
    } catch (err) {
      setError(`Error in fetching retail offers: ${err.toString()}`);
    }
    return null;
  }, [origin, endpoint]);

  useEffect(() => {
    const fetchNewOffer = async () => {
      setIsFetching(true);
      const offerResponse = await fetchOffer(campaignCode);
      setOffer(offerResponse);
      setIsFetching(false);
    };
    if (!offer && !isServerSide()) {
      fetchNewOffer();
    }
  }, [campaignCode, fetchOffer, offer]);

  return {
    error,
    offer,
    isFetching,
    fetchOffer,
  };
};

export default useOffer;
