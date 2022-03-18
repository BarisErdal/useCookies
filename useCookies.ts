import React, { useState, useCallback, useMemo } from "react";

const useCookies = () => {
  const [value, setValue] = useState<string>("");
  const [allCookies, setAllCookiesObj] = useState({});
  /*exdays gün kadar geçerli olan bir cookie set eder
  çağırılırken { name: "username" , value: "aasdf", exdays: 20 } obje alır
    */
  const setCookie = useCallback(({ name, value, exdays }) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/;`;
  }, []);
//cookie ismine göre cookie value'su getirir.
  const getCookie = useCallback((cname: any) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        setValue(c.substring(name.length, c.length));
        return;
      }
    }
    setValue("");
    return;
  }, []);
// cookie name'e göre cookie'yi siler
  const deleteCookie = useCallback((cname: string) => {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }, []);

  //bütün cookieleri obje'ye dönüştüren ara fonksiyon
  const getCookiesFunc = useCallback(() => {
    return document.cookie.split(";").reduce((cookies: any, cookie: any) => {
      const [name, value] = cookie.split("=").map((c: any) => c.trim());
      cookies[name] = value;
      return cookies;
    }, {});

  },[])
   
    
// bütün cookieleri state'e set eder.
  const getAllCookies = useCallback(() => {
    const allcookies = getCookiesFunc();

    setAllCookiesObj(allcookies);
  }, []);

// bütün cookieleri siler
  const deleteAllCookies = useCallback(() => {
    const allcookies = getCookiesFunc();
    for (let i in allcookies) {
      deleteCookie(i);
    }
  }, []);

  const returnObj = useMemo(
    () => ({
      value,
      allCookies,
      setCookie,
      getCookie,
      deleteCookie,
      getAllCookies,
      deleteAllCookies,
    }),
    [value, allCookies]
  );

  return returnObj;
};

export default useCookies;
