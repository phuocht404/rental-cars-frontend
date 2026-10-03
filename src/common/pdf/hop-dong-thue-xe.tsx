'use client';

import { CheckSquare, Square } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { GET_ORDER_DETAIL_BY_ID } from '@/lib/api-constants';
import { formatCurrency, formatDateToDMY, numberToText } from '@/lib/utils';
import { queryKeys, useApiQuery } from '@/lib/query';
import { ColorEnum } from '@/types/enums';
import BackButton from '@/components/back-button';

const HopDongThueXe = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const { slug } = useParams<{ slug: string }>();
  const { data: orderDetail = {} } = useApiQuery<any>(queryKeys.orderDetail(slug), `${GET_ORDER_DETAIL_BY_ID}/${slug}`);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);



  const handleDownloadPDF = async () => {
    const pdfContainer = pdfRef.current;
    if (!pdfContainer) return;

    setIsDownloading(true);

    // Hai thư viện này nặng (~400KB) nên chỉ tải khi người dùng thực sự bấm tải hợp đồng
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);
    const pdf = new jsPDF('p', 'mm', 'a4', true);

    const options = {
      scale: 2, // Increase scale for better resolution
      useCORS: true, // Enable cross-origin resource sharing
    };

    // Calculate A4 dimensions
    const a4Width = 210;
    const a4Height = 297;

    html2canvas(pdfContainer, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      pdf.setFont('Times New Roman', 'normal');

      const imgHeight = (canvas.height * a4Width) / canvas.width;
      let heightLeft = imgHeight;

      let positionY = 0;

      pdf.addImage(imgData, 'PNG', 0, positionY, a4Width, imgHeight);
      heightLeft -= a4Height;

      while (heightLeft >= 0) {
        positionY = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, positionY, a4Width, imgHeight);
        heightLeft -= a4Height;
      }

      const pdfData = pdf.output('blob');
      const url = URL.createObjectURL(pdfData);
      window.open(url, '_blank');
      setIsDownloading(false);
    });
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2">
        <BackButton />
        <Button onClick={handleDownloadPDF} isLoading={isDownloading}>
          Tải xuống
        </Button>
      </div>
      <div className="border border-gray-200 ">
        <div
          ref={pdfRef}
          className="w-full text-pretty px-20 py-16 text-[17px] text-black"
        >
          <div className="w-full text-center text-[19px]">
            <h2 className="font-medium">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
            <h4 className="my-1 italic">Độc lập - Tự do - Hạnh phúc</h4>
            <p>------ &#10041; ------</p>
          </div>

          <h1 className="mb-8 mt-4 text-center text-[22px] font-bold">
            HỢP ĐỒNG CHO THUÊ XE Ô TÔ TỰ LÁI
          </h1>

          <div className="italic">
            <p className="text-pretty">
              Căn cứ Bộ Luật Dân Sự số 91/2015/QH 13 và Bộ Luật Thương Mại số
              36/2015/QH 11 của Quốc Hội Nhà Nước Cộng Hoà Xã Hội Chủ Nghĩa Việt
              Nam ban hành ngày 14/06/2005.
            </p>
            <p className="">
              Và nhu cầu sử dụng dịch vụ thuê xe tự lái của Quý Khách Hàng.
            </p>
            <p>
              .............., ngày ..........tháng ............ năm
              ................
            </p>
          </div>

          {/* Ben A */}
          <div className="my-6">
            <h2 className="text-[17px] font-bold uppercase">
              BÊN A (CHO THUÊ XE):
            </h2>
            <h3 className="text-[17px] font-bold">&#9830; Đại diện:</h3>
            <div className="flex flex-col justify-start *:flex *:w-full *:justify-between">
              <span className="">
                <p>
                  {' '}
                  - Ông (Bà): <strong>{orderDetail?.car?.user?.name}</strong>
                </p>
                <p>
                  Mobile:{' '}
                  {orderDetail?.car?.user?.phone
                    ? orderDetail?.car?.user?.phone
                    : '.........................................................................'}
                </p>
              </span>
              <span className="">
                <p>
                  - Địa chỉ:{' '}
                  {orderDetail?.car?.user?.address
                    ? orderDetail?.car?.user?.address
                    : '.......................................................................................................................................................................'}
                </p>
              </span>
              <span className="">
                - CCCD số:
                ..........................................................Cấp
                ngày: .......................Tại:
                .........................................................
              </span>
              <span className="">
                - Địa chỉ ĐKTT:
                ......................................................................................................................................................
              </span>
            </div>
          </div>

          {/* Ben B */}
          <div className="my-6">
            <h2 className="text-[17px] font-bold uppercase">
              BÊN B (THUÊ XE):
            </h2>
            <h3 className="text-[17px] font-bold">&#9830; Đại diện:</h3>
            <div className="flex flex-col justify-start *:flex *:w-full *:justify-between">
              <span className="">
                <p>
                  {' '}
                  - Ông (Bà):{' '}
                  <strong>{orderDetail?.order?.traveler?.name}</strong>
                </p>
                <p>
                  Mobile:{' '}
                  {orderDetail?.order?.traveler?.phone
                    ? orderDetail?.order?.traveler?.phone
                    : '.........................................................................'}
                </p>
              </span>
              <span className="">
                <p>
                  - Địa chỉ:{' '}
                  {orderDetail?.order?.traveler?.address
                    ? orderDetail?.order?.traveler?.address
                    : '.......................................................................................................................................................................'}
                </p>
              </span>
              <span className="">
                - CCCD số:
                ..........................................................Cấp
                ngày: .......................Tại:
                .........................................................
              </span>
              <span className="">
                - Địa chỉ ĐKTT:
                ......................................................................................................................................................
              </span>
              <span className="">
                - Giấy phép lái xe
                số:.............................................................................................................................................
              </span>
            </div>
          </div>

          <p className="italic">
            Sau khi bàn bạc hai bên thống nhất ký hợp đồng thuê ô tô tự lái với
            các điều khoản sau:
          </p>

          {/* Dieu khoan */}
          <div className="my-6 flex flex-col items-start justify-between gap-6">
            {/* Dieu 1 */}
            <div className="">
              <h2 className="text-[17px] font-bold uppercase">
                ĐIỀU I: NỘI DUNG HỢP ĐỒNG
              </h2>
              <div>
                <p className="">
                  Bên A cho Bên B thuê 01 (một) xe ô tô. Chiếc xe hiệu: &emsp;
                  {orderDetail?.car?.brand}
                </p>
                <div className="flex w-full items-center justify-around *:font-bold">
                  <span className="flex items-center justify-center gap-1">
                    Xăng 95{' '}
                    {orderDetail?.car?.fuel === 'GASOLINE' ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    Dầu Diesel{' '}
                    {orderDetail?.car?.fuel === 'DIESEL' ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    Điện{' '}
                    {orderDetail?.car?.fuel === 'ELECTRIC' ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </span>
                </div>
                <span className="flex justify-between gap-2">
                  <p>Biển số: &ensp;{orderDetail?.car?.licensePlates}</p>
                  <p>Số chỗ ngồi: &ensp;{orderDetail?.car?.seats}</p>
                  <p>Màu sơn: &ensp; {ColorEnum[orderDetail?.car?.color]}</p>
                </span>
                <span className="block">
                  Số máy: .................................. Số khung:
                  ................................... Tên chủ xe:
                  .....................................................
                </span>
                <span className="block">
                  Mức nhiên liệu hiện tại (Range)
                  ...................................... Số Km hiện tại (ODO)
                  .................................................
                </span>

                <div className="*:block">
                  <h4 className="font-bold italic">
                    * Cung cấp các giấy tờ sau cho Bên B (thuê xe):
                  </h4>
                  <p>
                    Giấy đăng ký xe số:
                    ...................................................................................................................
                    (photo/bản gốc).
                  </p>
                  <p>
                    Đăng kiểm số:
                    ............................................................................................................................
                    (photo/bản gốc).
                  </p>
                  <p>
                    Bảo hiểm xe số
                    ..........................................................................................................................
                    (photo/bản gốc).
                  </p>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">
                    * Giá thuê xe – Thời gian thuê xe – Hình thức thanh toán:
                  </h4>
                  <ul className="ml-6 *:list-decimal">
                    <li>
                      <span className="flex justify-between">
                        <p>
                          Giá thuê:{' '}
                          {formatCurrency(orderDetail?.car?.pricePerDay)}{' '}
                          đồng/ngày.
                        </p>
                        <p>
                          Bằng chữ: &ensp;
                          {numberToText(orderDetail?.car?.pricePerDay)}
                        </p>
                      </span>
                      <p className="italic">
                        Giá chưa gồm: nhiên liệu, Vat, phí cầu đường, bến bãi và
                        các khoản phạt (nếu có).
                      </p>
                    </li>

                    <li>
                      Lộ trình thuê xe:
                      ..............................................................................................................................................
                    </li>
                    <li>
                      Thời gian: ........ giờ........., ngày{' '}
                      {formatDateToDMY(orderDetail.startDate)} &emsp; đến
                      ........ giờ........., ngày{' '}
                      {formatDateToDMY(orderDetail.endDate)}
                    </li>
                    <li>
                      Tổng giá thuê xe:{' '}
                      {formatCurrency(orderDetail?.totalAmount)}
                    </li>
                    <li>
                      Đã đặt cọc trước: {formatCurrency(orderDetail?.deposits)}.
                      &emsp;&emsp;&emsp;Còn lại:{' '}
                      {formatCurrency(
                        orderDetail?.totalAmount - orderDetail?.deposits,
                      )}
                    </li>
                    <li>
                      Giới hạn Kilometers theo hợp đồng: ....................
                      km/ngày, nếu đi quá giới hạn kilometers cho phép thì phải
                      chịu trả thêm 5 000đ/ 01km, vượt quá thời gian thuê thì
                      khách thuê phải trả thêm 100 000đ/ 01giờ).
                    </li>
                  </ul>

                  <span className="mb-32 mt-3">
                    Bên B đã thanh toán trước <strong>30%</strong> giá trị hợp
                    đồng sau khi kết nối thành công với bên A thông qua ứng dụng
                    cho thuê xe{' '}
                    <p className="inline text-primary">Rental Cars</p>. Bên B
                    thanh toán <strong>70%</strong> còn lại cho bên A bằng hình
                    thức tiền mặt hoặc chuyển khoản ngay sau khi ký hợp đồng
                    này.{' '}
                  </span>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">
                    * Thế chấp tài sản/ giấy tờ sau cho bên A (cho thuê xe):
                  </h4>
                  <ul className="ml-6 *:list-decimal">
                    <li>
                      {' '}
                      Tiền mặt/ chuyển khoản:
                      .............................................................................
                      đồng (bàn giao khi ký Hợp Đồng).
                    </li>
                    <li>
                      Loại xe:
                      ...............................................................................................................................................................
                    </li>
                    <li>
                      Giấy tờ:..........
                      ...................................................................
                      Cavet số:
                      .................................................................
                    </li>
                  </ul>

                  <strong className="text-sm italic">
                    &emsp;&emsp;&ensp;Bên A hoàn trả lại cho Bên B đầy đủ phần
                    thế chấp sau khi hoàn tất Hợp đồng
                  </strong>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">* Thoả thuận thêm:</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Rửa xe sạch sẽ trước khi trả theo như tình trạng lúc nhận
                      xe (hoặc trả phí rửa xe là 100.000đ cho bên A)
                    </li>
                    <li>
                      Nếu có phát sinh thêm hợp đồng thuê xe thì phải báo cho{' '}
                      <strong>Rental Cars</strong> , bên A trước và phải được
                      bên A đồng ý. Trường hợp bên B thông báo cho bên A về việc
                      kéo dài thêm thời gian và thời gian kéo dài vượt quá 05
                      giờ thì bên B phải thanh toán cho bên A thêm 01 ngày thuê
                      xe theo đơn giá trên hợp đồng.
                    </li>
                    <li>
                      Khi thuê xe mà xảy ra sự cố va quẹt, đâm đụng (trầy xước,
                      cấn, móp, hư hỏng.…), bên B có trách nhiệm báo ngay cho
                      bên A và phối hợp với bên A để bên A thông báo cho đơn vị
                      bảo hiểm để công ty bảo hiểm thanh toán chi phí sửa chữa,
                      thay thế và bên A sẽ giữ lại toàn bộ tài sản và giấy tờ
                      thế chấp của bên B khi thuê xe.{' '}
                      <strong>
                        Thời gian xe nằm lại tại Garage để sửa chữa nếu nằm
                        ngoài thời hạn thuê thì bên B phải thanh toán tiền cho
                        bên A là 50% đơn giá thuê xe cho mỗi ngày sửa chữa.
                      </strong>
                    </li>
                    <li>
                      Nếu xảy ra va chạm gây thiệt hại hoặc hư hỏng toàn bộ xe
                      mà do lỗi cố ý của bên B thì bên B có trách nhiệm đền bù
                      thiệt hại (nếu thiệt hại lớn nhưng chưa toàn bộ) hoặc đền
                      bù cho bên A một chiếc xe tương đương với cùng mức độ sử
                      dụng của chiếc xe cho thuê hiện hữu tại thời điểm xảy ra
                      thiệt hại hoặc hư hỏng (nếu hư hỏng toàn bộ). Các bên sẽ
                      thống nhất đại lý giám định thiệt hại trong trường hợp
                      này. Riêng trường hợp xảy ra thiệt hại hoặc hỏa hoạn không
                      do lỗi của bên B (ví dụ do xe tự cháy…) thì bên B được
                      miễn trừ trách nhiệm này.
                    </li>
                    <li>
                      Giữ lại số
                      tiền..........................................đồng trong
                      vòng .................. ngày để kiểm tra phạt nguội trong
                      thời gian bên B thuê xe. Bên A hoàn trả đủ số tiền đã cấn
                      trừ tiền phạt (nếu có) qua số tài khoản
                      ......................................,Chủ tài khoản
                      ....................................... Ngân
                      hàng..................................
                    </li>
                    <li>
                      Thỏa thuận khác:
                      ..............................................................................................................................
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dieu 2 */}
            <div className="">
              <h2 className="text-[17px] font-bold uppercase">
                ĐIỀU II: QUYỀN VÀ NGHĨA VỤ CỦA BÊN A
              </h2>
              <div>
                <div className="*:block">
                  <h4 className="font-bold italic">2.1 Quyền của bên A</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Bên A có quyền đơn phương chấm dứt hợp đồng và yêu cầu bên
                      B trả xe trước hạn hợp đồng nếu bên A phát hiện bên B sử
                      dụng sai mục đích hoặc vi phạm các điều khoản thỏa thuận
                      trong hợp đồng này. Hoặc làm hư hỏng, mất mát tài sản
                      thuê, sửa chữa, cho người khác thuê lại mà không có sự
                      đồng ý của Bên A.
                    </li>
                    <li>
                      Trình báo công an và <strong>Rental Cars</strong> khi bên
                      A phát hiện bên B tắt thiết bị định vị trên xe, mất liên
                      lạc quá 4 tiếng hoặc quá thời hạn thuê xe nhưng không giao
                      xe cho bên A.
                    </li>
                    <li>
                      Được nhận đủ tiền thuê xe theo đúng thỏa thuận, tiền vượt
                      quá giờ, quá kilometers, và tiền bồi thường thiệt hại về
                      xe (nếu có).
                    </li>
                  </ul>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">2.2 Nghĩa vụ của bên A</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Giao đúng cho bên B các giấy tờ xe liên quan bao gồm: giấy
                      đăng ký xe ô tô (bản photo sao y trong thời hạn 06 tháng),
                      giấy kiểm định xe ô tô (bản chính), giấy bảo hiểm xe ô tô
                      bắt buộc (bản chính).
                    </li>
                    <li>
                      Giao xe đúng địa chỉ và thời gian như thỏa thuận, xe trong
                      tình trạng an toàn, sạch sẽ, đảm bảo xe đang vận hành tốt.
                      Hỗ trợ cho bên B trong suốt quá trình thuê xe khi cần.
                    </li>
                    <li>
                      Bên A hoàn trả đầy đủ tài sản mà bên B đã thế chấp sau khi
                      hoàn tất hợp đồng và chịu trách nhiệm bồi thường nếu bên A
                      làm thiệt hại tài sản đó.
                    </li>
                    <li>
                      Hoàn trả lại số tiền mà bên B đã đặt cọc trong trường hợp
                      xe hư hỏng không thể sửa chữa kịp để giao cho bên B và
                      không có xe tương đương thay thế.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dieu 3 */}
            <div className="">
              <h2 className="text-[17px] font-bold uppercase">
                ĐIỀU III: QUYỀN VÀ NGHĨA VỤ CỦA BÊN B
              </h2>
              <div>
                <div className="*:block">
                  <h4 className="font-bold italic">3.1 Quyền của bên B</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Nhận đúng xe như thỏa thuận tại Điều I và giấy tờ liên
                      quan đến xe theo Hợp Đồng.
                    </li>
                    <li>
                      Yêu cầu bên A đổi xe nếu xe không đúng như thỏa thuận hoặc
                      xe hư hỏng không đảm bảo cho quá trình thuê.
                    </li>
                    <li className="mb-44">
                      Nếu xe hư hỏng trong quá trình thuê mà không phải lỗi do
                      bên B thì bên B liên hệ với bên A và có quyền yêu cầu bên
                      A thanh toán phần chi phí sửa chữa hợp lý sau khi đã thỏa
                      thuận.
                    </li>
                    <li>
                      Đơn phương chấm dứt hợp đồng và yêu cầu bồi thường thiệt
                      hại nếu bên A thực hiện các hành vi sau:
                      <ul className="ml-6 *:list-outside">
                        <li>
                          + Bên A giao xe không đúng thời hạn như thỏa thuận,
                          trừ trường hợp bất khả kháng (mưa bão, thiên tai, dịch
                          bệnh…). Bên nào viện dẫn trường hợp bất khả kháng thì
                          bên đó có nghĩa vụ chứng minh. Trường hợp giao xe chậm
                          gây thiệt hại cho Bên B thì phải bồi thường.
                        </li>
                        <li>
                          + Xe bị hư hỏng dẫn đến bên B không đạt được mục đích
                          thuê mà bên B không biết
                        </li>
                        <li>
                          + Xe có tranh chấp về quyền sở hữu giữa bên A với bên
                          thứ ba mà bên B không biết dẫn đến bên B không sử dụng
                          được xe trong quá trình thuê như đã thỏa thuận.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">3.2 Nghĩa vụ của bên B</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Thanh toán đầy đủ tiền thuê xe như thỏa thuận tại Điều I
                      và tiền bồi thường nếu gây ra tình trạng hư hỏng cho xe.
                    </li>
                    <li>
                      Cung cấp đầy đủ giấy tờ cần thiết cho bên A khi ký hợp
                      đồng (CCCD gắn chíp, GPLX….). Đặt cọc Hộ khẩu/ Passport,
                      tiền mặt hoặc tài sản có giá trị tương đương (xe máy cà
                      vẹt chỉnh chủ...). Chịu trách nhiệm về nguồn gốc tài sản
                      thế chấp.
                    </li>
                    <li className="font-bold">
                      Bên B không mang xe cho thuê lại, không sang nhượng hợp
                      đồng, không được bán xe hay cầm cố thế chấp, không được
                      tắt định vị với bất kỳ lý do nào và không đưa xe cho người
                      không có GPLX tương ứng với xe.
                    </li>
                    <li>
                      Nhận xe và trả xe đúng địa điểm, thời gian như thỏa thuận.
                      Không điều khiển xe ra khỏi lãnh thổ Việt Nam.
                    </li>
                    <li>
                      Khi nhận xe bên B phải xem kỹ hiện trạng của xe và có
                      trách nhiệm bảo quản xe, chịu trách nhiệm dân sự và hình
                      sự trong suốt thời gian thuê xe, bên B tự túc nhiên liệu
                      (phù hợp với xe).
                    </li>
                    <li className="font-bold">
                      Trường hợp vi phạm luật giao thông trong thời gian thuê xe
                      (kể cả việc không bị xử phạt tại chỗ nhưng khi có biên bản
                      gửi về) hoặc lưu thông qua những nơi bắn tốc độ tự động và
                      phạt nguội (như cao tốc, hầm vượt sông). Bên B sẽ phải
                      thanh toán tiền phạt cho bên A lúc có biên bản gửi về theo
                      đúng mức xử phạt của cơ quan chức năng và phải trả tiền
                      thuê xe trong thời gian chờ xử lý vi phạm giao thông (giam
                      xe) tính như giá thuê ở trên.
                    </li>
                    <li>
                      Nếu bên B làm mất xe phải bồi thường 100% giá trị của xe
                      theo định giá tại thời điểm mất xe, bao gồm chi phí làm
                      giấy tờ xe.
                    </li>
                    <li>
                      Nếu bên B làm mất xe phải bồi thường 100% giá trị của xe
                      theo định giá tại thời điểm mất xe, bao gồm chi phí làm
                      giấy tờ xe.
                    </li>
                    <li>
                      Không được chuyên chở bất cứ loại vũ khí hay chất nổ, hàng
                      có mùi hôi thối và hàng quốc cấm, không được thay đổi các
                      chi tiết phụ tùng và trang bị của xe.
                    </li>
                    <li>
                      Trong thời gian thuê xe, nếu bên A không liên lạc được với
                      bên B (trong vòng 04 giờ) bên A được quyền nhờ cơ quan
                      chức năng tìm kiếm và thu hồi xe về, bên B phải chịu mất
                      tiền cọc, phí thuê xe, phí thu hồi xe và tài sản thế chấp.
                    </li>
                    <li>
                      Phải thanh toán tiền xe đúng ngày trong hợp đồng, bên B
                      phải trả thêm phí vượt thời gian, vượt kilometers (nếu
                      có). Thanh toán đầy đủ chi phí nếu làm hư hại xe (tùy theo
                      mức độ) mà nằm ngoài thời gian bảo hiểm chuyến đi (được
                      mua trên ứng dụng <strong>Rental Cars</strong> ). Nếu bên
                      B không thanh toán như thỏa thuận thì mất cọc.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dieu 4 */}
            <div className="">
              <h2 className="text-[17px] font-bold uppercase">
                ĐIỀU IV: CHÍNH SÁCH BẢO HIỂM THEO CHUYẾN ĐI
              </h2>
              <div>
                <div className="*:block">
                  <h4 className="font-bold italic">
                    4.1 Đối tượng bảo hiểm và thời gian bảo hiểm:
                  </h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Chỉ áp dụng với chuyến đi có mua bảo hiểm chuyến đi trên
                      ứng dụng đặt xe <strong>Rental Cars</strong>.
                    </li>
                    <li>
                      Thời gian bảo hiểm tính từ thời gian bên B bắt đầu và hết
                      hiệu lực theo thời gian bên B kết thúc chuyến đi đã đăng
                      ký trên ứng dụng <strong>Rental Cars</strong>.
                    </li>
                  </ul>
                </div>

                <div className="*:block">
                  <h4 className="font-bold italic">4.2 Phạm vi bảo hiểm:</h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Nhà bảo hiểm chịu trách nhiệm bồi thường cho bên A những
                      thiệt hại vật chất do thiên tai, tai nạn bất ngờ, va chạm
                      xe, không lường trước được trong những trường hợp sau:
                      <ul className="ml-6">
                        <li>
                          + Đâm, va (bao gồm cả va chạm với vật thể khác ngoài
                          xe cơ giới).
                        </li>
                        <li>+ Hỏa hoạn, cháy, nổ.</li>
                        <li>+ Mất cắp nguyên chiếc.</li>
                        <li>
                          + Thủy kích (khấu trừ 20% số tiền bảo hiểm, tối thiểu
                          3.000.000 VNĐ tuỳ vào số nào lớn hơn).
                        </li>
                      </ul>
                    </li>
                    <li>Mức khấu trừ tối đa: 2.000.000 vnđ/ vụ.</li>
                  </ul>
                </div>

                <div className="*:block">
                  <h4 className="mt-44 font-bold italic">
                    4.3 Quyền và nghĩa vụ:
                  </h4>
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Trường hợp chuyến đi được hỗ trợ bảo hiểm chuyến do{' '}
                      <strong>Rental Cars</strong>
                      cung cấp, khi xảy ra sự cố va chạm trong quá trình di
                      chuyển, bên B có trách nhiệm báo ngay cho bên A. Bên B
                      phải chụp hình ảnh hiện trường sự cố và liên hệ ngay tổng
                      đài bảo hiểm để khai báo sự cố và làm theo hướng dẫn xử
                      lý.
                    </li>
                    <li>
                      Bên B có trách nhiệm thanh toán chi phí sửa chữa theo điều
                      khoản bảo hiểm được quy đinh r trong chi tiết chuyến đi
                      trên ứng dụng <strong>Rental Cars</strong>.
                    </li>
                    <li>
                      Bên B có nghĩa vụ phối hợp với bên A để xử lý sự cố theo
                      hướng dẫn của nhà bảo hiểm.
                    </li>
                    <li>
                      Trường hợp bên B báo sự cố phát sinh ngoài thời gian của
                      chuyến thuê xe trên ứng dụng <strong>Rental Cars</strong>{' '}
                      và không được bảo hiểm bồi thường sự cố, bên B phải có
                      nghĩa vụ thực hiện đền bù theo điều khoản 5.2.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dieu 5 */}
            <div className="">
              <h2 className="text-[17px] font-bold uppercase">
                ĐIỀU V: ĐIỀU KHOẢN CHUNG
              </h2>
              <div>
                <div className="*:block">
                  <ul className="ml-6 *:list-disc *:text-justify">
                    <li>
                      Hợp đồng này và các phụ lục bổ sung hợp đồng là bộ phận
                      không tách rời của hợp đồng, các bên phải có nghĩa vụ thực
                      hiện, cam kết thi hành đúng các điều khoản của hợp đồng,
                      không bên nào tự ý đơn phương sửa đổi, đình chỉ hoặc hủy
                      bỏ hợp đồng. Mọi sự vi phạm phải được xử lý theo pháp
                      luật.
                    </li>
                    <li>
                      Trong quá trình thực hiện hợp đồng, nếu có vấn đề phát
                      sinh các bên sẽ cùng bàn bạc giải quyết trên tinh thần hợp
                      tác và tôn trọng lợi ích của cả hai bên và được thể hiện
                      bằng văn bản. Nếu không giải quyết được thì đưa ra Tòa án
                      nhân dân có thẩm quyền để giải quyết. Bên thua kiện sẽ
                      chịu toàn bộ chi phí.
                    </li>
                    <li>
                      Hợp đồng này được thanh lý khi bên B hoàn trả xe cho bên
                      A, được bên A chấp nhận và thanh toán các chi phí liên
                      quan.
                    </li>
                    <li>
                      Hợp đồng này gồm năm điều, bốn trang được lập thành hai
                      bản, mỗi bên giữ một bản, có giá trị pháp lý như nhau kể
                      từ ngày ký.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Ky ten */}
          <div className="flex items-center justify-around gap-3">
            <div className="inline">
              <strong>ĐẠI DIỆN BÊN A</strong> (Chủ xe)
            </div>
            <div className="inline">
              <strong>ĐẠI DIỆN BÊN B</strong> (Khách thuê)
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HopDongThueXe;
